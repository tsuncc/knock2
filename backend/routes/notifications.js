import express from "express";
import db from "../utils/connect.js";
import moment from "moment-timezone";

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

const router = express.Router();

const clients = new Map();

// SSE 連線 api
router.get("/notification_center", async (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ error: "未輸入user_id" });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // res.write(
  //   `data: ${JSON.stringify({
  //     id: 0,
  //     type: getMessageType("system"),
  //     message: "連接成功",
  //     created_at: moment(new Date()).format(dateTimeFormat),
  //     is_read: "1",
  //   })}\n\n`
  // );

  clients.set(user_id, res);

  req.on("close", () => {
    clients.delete(user_id);
  });
});

// 讀取儲存的通知的路由
router.post("/previous_notification", async (req, res) => {
  const { user_id, page } = req.body;

  const output = {
    success: false,
    error: "",
    data: [],
    unreadMessages: 0,
  };
  const recentNotifications = await fetchUserNotifications(user_id, page);
  const unreadMessages = await countUnreadMessages(user_id);

  output.data = recentNotifications;
  output.unreadMessages = unreadMessages;
  output.success = true;
  res.json(output);
});

// 更新通知為已讀的路由
router.post("/mark_message_read", async (req, res) => {
  const { user_id, notification_id } = req.body;
  const result = await markMessageAsRead(user_id, notification_id);
  const unreadMessages = await countUnreadMessages(user_id);
  res.json({ success: result, unreadMessages });
});

// 發送個人通知的路由
router.post("/send-personal", (req, res) => {
  const { user_id, message } = req.body;
  if (user_id && message) {
    sendNotificationToUser(user_id, message);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "缺少 user_id 或 message 資訊" });
  }
});

// 發送全體通知的路由
router.post("/send-all", (req, res) => {
  const { message } = req.body;
  if (message) {
    sendNotificationToAll(message);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "缺少 message 資訊" });
  }
});

// 發送通知的文字處理
const sendNotificationToClient = (
  user_id,
  client,
  notification,
  notification_id
) => {
  try {
    const newNotification = {
      ...notification,
      id: notification_id,
      type: getMessageType(notification.type),
      is_read: "0",
    };
    if (client && typeof client.write === "function") {
      client.write(`data: ${JSON.stringify(newNotification)}\n\n`);
      return true;
    } else {
      console.error(`用戶id: ${user_id} 無效`);
      clients.delete(user_id);
      return false;
    }
  } catch (error) {
    console.error(`傳送通知至 用戶id: ${user_id} 失敗:`, error);
    clients.delete(user_id);
    return false;
  }
};

// 發送個人通知
export const sendNotificationToUser = async (user_id, message) => {
  const client = clients.get(user_id);
  const notification = {
    type: "personal",
    message,
    created_at: moment(new Date()).format(dateTimeFormat),
  };

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const sql_notification = `INSERT INTO notifications SET ?, is_public = "0"`;
    const [result_notification] = await connection.query(
      sql_notification,
      notification
    );
    const notification_id = result_notification.insertId;

    // 判斷是否在線上的話發送訊息
    if (client) {
      sendNotificationToClient(user_id, client, notification, notification_id);
    }

    const sql_user_notification = `INSERT INTO user_notifications (user_id, notification_id) VALUES (?,?)`;
    await connection.query(sql_user_notification, [user_id, notification_id]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("發送和存儲個人通知失敗:", error);
  } finally {
    connection.release();
  }
};

// 發送全體通知
export const sendNotificationToAll = async (message) => {
  const notification = {
    type: "public",
    message,
    created_at: moment(new Date()).format(dateTimeFormat),
  };

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const sql = `INSERT INTO notifications SET ?, is_public = "1"`;
    const [result] = await connection.query(sql, notification);
    const notification_id = result.insertId;

    const userNotifications = [];
    clients.forEach((client, user_id) => {
      if (
        sendNotificationToClient(user_id, client, notification, notification_id)
      ) {
        userNotifications.push([user_id, notification_id]);
      }
    });

    if (userNotifications.length > 0) {
      const sql = `INSERT INTO user_notifications (user_id, notification_id) VALUES ?`;
      await connection.query(sql, [userNotifications]);
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("發送和儲存全體通知失敗:", error);
  } finally {
    connection.release();
  }
};

// 讀取儲存的通知
const fetchUserNotifications = async (user_id, page) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 取得用戶目前最後一筆資料的時間
    const [lastReceivedRow] = await connection.query(
      `SELECT created_at FROM notifications JOIN user_notifications ON notifications.id = notification_id WHERE user_id = ? AND is_public = 1 ORDER BY created_at DESC LIMIT 1`,
      [user_id]
    );

    const lastReceivedTime =
      lastReceivedRow.length > 0 ? lastReceivedRow[0].created_at : new Date(0);

    // 取得最後一筆時間之後更新的 全體通知
    const [publicNotifications] = await connection.query(
      `
      SELECT 
        n.id,
        n.type,
        n.message,
        n.created_at,
        n.is_public
      FROM 
        notifications n
      WHERE
        n.is_public = '1'
        AND n.created_at > ?
        AND n.id NOT IN (
          SELECT notification_id 
          FROM user_notifications 
          WHERE user_id = ?
        )
      ORDER BY 
        n.created_at DESC
    `,
      [lastReceivedTime, user_id]
    );

    // 更新用戶的全體通知記錄
    if (publicNotifications.length > 0) {
      const newPublicData = publicNotifications
        .map((v) => `(${user_id},${v.id},'0')`)
        .join(", ");

      await connection.query(
        `
        INSERT INTO user_notifications (user_id, notification_id, is_read)
        VALUES ${newPublicData}
      `
      );
    }

    page = page || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    // 取得用戶目前領取的通知
    const [personalNotifications] = await connection.query(
      `
      SELECT 
        n.id,
        n.type,
        n.message,
        n.created_at,
        un.is_read
      FROM 
        notifications n
      JOIN 
        user_notifications un 
      ON 
      n.id = un.notification_id 
      WHERE
        un.user_id = ?
      ORDER BY 
        n.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [user_id, pageSize, offset]
    );

    // 合併個人通知和新的全體通知，處理日期時間格式，並全體通知加上 is_read : 0 + 排序
    const allNotifications = [
      ...personalNotifications.map((notification) => ({
        ...notification,
        type: getMessageType(notification.type),
        created_at: moment(notification.created_at).format(dateTimeFormat),
      })),
    ];

    await connection.commit();
    return allNotifications;
  } catch (error) {
    await connection.rollback();
    console.error("獲取通知失敗:", error);
    return null;
  } finally {
    connection.release();
  }
};

// 計算未讀訊息數量
const countUnreadMessages = async (user_id) => {
  try {
    const [result] = await db.query(
      `SELECT COUNT(*) AS count FROM user_notifications WHERE user_id = ? AND is_read = 0`,
      [user_id]
    );
    return result[0].count;
  } catch (error) {
    console.error("獲取未讀訊息數失敗:", error);
    return 0;
  }
};

// 分辨通知類型的函式
const getMessageType = (type) => {
  switch (type) {
    case "personal":
      return "個人通知";
    case "public":
      return "全站消息";

    default:
      return "系統通知";
  }
};

// 更新通知為已讀的函式
const markMessageAsRead = async (user_id, notification_id) => {
  const sql = `
    UPDATE user_notifications un
    JOIN notifications n ON un.notification_id = n.id
    SET un.is_read = 1
    WHERE un.user_id = ? AND n.id = ?
  `;
  const [result] = await db.query(sql, [user_id, notification_id]);

  if (!result.affectedRows) {
    return false;
  } else {
    return true;
  }
};

export default router;
