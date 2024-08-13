import express from "express";
import db from "./../utils/connect.js";
import moment from "moment-timezone";

const router = express.Router();

// 獲取主题列表的函數
const getThemesList = async (branchId) => {
  let success = false;

  const sql = `
  SELECT 
    t.theme_id,
    t.theme_name,
    t.theme_img,
    t.difficulty,
    t.introduction,
    t.min_players,
    t.max_players,
    t.theme_time,
    b.branch_name,
    bt.branch_themes_id  
  FROM themes t
  LEFT JOIN branch_themes bt ON t.theme_id = bt.theme_id
  LEFT JOIN branches b ON bt.branch_id = b.branch_id
  WHERE b.branch_id = ?
  ORDER BY t.theme_id DESC
`;

  try {
    const [rows] = await db.query(sql, [branchId]);
    success = true;
    return {
      success,
      themes: rows,
    };
  } catch (err) {
    console.error("Error fetching themes:", err);
    return { success };
  }
};

// 獲取第二個分店主題列表的函數
const getSecondThemesList = async () => {
  let success = false;

  const sql = `
 SELECT 
  t.theme_id,
  t.theme_name,
  t.theme_img,
  t.difficulty,
  t.introduction,
  t.min_players,
  t.max_players,
  t.theme_time,
  b.branch_name,
  bt.branch_themes_id  
FROM themes t
LEFT JOIN branch_themes bt ON t.theme_id = bt.theme_id
LEFT JOIN branches b ON bt.branch_id = b.branch_id
ORDER BY t.theme_id DESC
`;

  try {
    const [rows] = await db.query(sql);
    success = true;
    return {
      success,
      themes: rows,
    };
  } catch (err) {
    console.error("Error fetching themes:", err);
    return { success };
  }
};

// 主題詳情
const getThemesDetails = async (branch_themes_id, selectedDate, user_id) => {
  console.log(
    `Starting getThemesDetails for branch_themes_id: ${branch_themes_id}, selectedDate: ${selectedDate}, user_id: ${user_id}`
  );

  const sql = `
  SELECT 
    bt.branch_themes_id,
    t.theme_id,
    t.theme_name,
    t.theme_img,
    t.theme_banner,
    t.min_players,
    t.max_players,
    t.theme_time,
    t.difficulty,
    t.price,
    t.deposit,
    t.theme_desc,
    t.theme_mp4,
    t.bg_music,
    b.branch_name,
    f.storyline,
    f.puzzle_design,
    f.atmosphere,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'sessions_id', s.sessions_id,
        'start_time', DATE_FORMAT(s.start_time, '%H:%i'),
        'end_time', DATE_FORMAT(s.end_time, '%H:%i'),
        'theme_time', s.theme_time,
        'intervals', s.intervals,
        'is_booked', IF(EXISTS (
          SELECT 1 FROM reservations r 
          WHERE r.session_id = s.sessions_id 
          AND r.branch_themes_id = bt.branch_themes_id
          AND r.reservation_date = ?
          AND r.reservation_status_id = 1
          AND r.cancel = 0
        ), 1, 0)
      )
    ) AS sessions,
    (SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'coupon_name', c.coupon_name,
        'discount_amount', c.discount_amount,
        'discount_percentage', c.discount_percentage
      )
    ) FROM coupons c
    WHERE c.coupon_type_id = 3
    AND c.valid_from <= NOW()
    AND c.valid_until >= NOW()
    AND (c.max_usage_per_user > (
      SELECT COUNT(*) FROM user_coupons uc
      WHERE uc.coupon_id = c.id AND uc.user_id = ?
    ) OR c.max_usage_per_user = 0)
    AND NOT EXISTS (
      SELECT 1 FROM user_coupons uc
      WHERE uc.coupon_id = c.id AND uc.user_id = ?
    )
    ) AS available_coupons
  FROM branch_themes bt
  JOIN themes t ON bt.theme_id = t.theme_id
  JOIN branches b ON bt.branch_id = b.branch_id
  LEFT JOIN feedback f ON bt.feedback_id = f.feedback_id
  JOIN sessions s ON bt.theme_id = s.theme_id
  WHERE bt.branch_themes_id = ?
  GROUP BY bt.branch_themes_id, t.theme_id, t.theme_name, t.theme_img, t.theme_banner, t.min_players, t.max_players, t.theme_time, t.difficulty, t.price, t.deposit, t.theme_desc,t.theme_mp4,t.bg_music, b.branch_name, f.storyline, f.puzzle_design, f.atmosphere;
  `;

  try {
    console.log("Executing SQL query...");
    const [rows] = await db.query(sql, [
      selectedDate,
      user_id,
      user_id,
      branch_themes_id,
    ]);
    console.log(`Query executed. Rows returned: ${rows.length}`);

    if (rows && rows.length > 0) {
      console.log("Processing query results...");

      // 解析 sessions
      if (typeof rows[0].sessions === "string") {
        try {
          rows[0].sessions = JSON.parse(rows[0].sessions);
          console.log(`Parsed sessions. Count: ${rows[0].sessions.length}`);
        } catch (parseError) {
          console.error("Error parsing sessions JSON:", parseError);
          rows[0].sessions = [];
        }
      }

      // 解析 available_coupons
      if (typeof rows[0].available_coupons === "string") {
        try {
          rows[0].available_coupons = JSON.parse(rows[0].available_coupons);
          console.log(
            `Parsed available_coupons. Count: ${rows[0].available_coupons.length}`
          );
        } catch (parseError) {
          console.error("Error parsing available_coupons JSON:", parseError);
          rows[0].available_coupons = [];
        }
      } else if (rows[0].available_coupons === null) {
        console.log("No available coupons found.");
        rows[0].available_coupons = [];
      }

      // 檢查並記錄可用優惠券
      if (Array.isArray(rows[0].available_coupons)) {
        console.log("Available coupons:", rows[0].available_coupons);
      } else {
        console.warn(
          "available_coupons is not an array:",
          rows[0].available_coupons
        );
        rows[0].available_coupons = [];
      }

      console.log("Theme details processed successfully.");
      return {
        success: true,
        theme: rows[0],
      };
    } else {
      console.log("No rows returned from query");
      return {
        success: false,
        theme: null,
        message: "No theme found for the given branch_themes_id",
      };
    }
  } catch (err) {
    console.error("Error fetching theme details:", err);
    return {
      success: false,
      theme: null,
      message: "Error fetching theme details: " + err.message,
    };
  }
};

router.get("/details/:branch_themes_id", async (req, res) => {
  const { branch_themes_id } = req.params;
  const date = req.query.date
    ? new Date(req.query.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];
  const user_id = req.query.user_id;

  console.log(
    `Received request for branch_themes_id: ${branch_themes_id}, date: ${date}, user_id: ${user_id}`
  );

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    const data = await getThemesDetails(branch_themes_id, date, user_id);
    console.log("getThemesDetails result:", JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error("Error in /details route:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
});

// 獲取分店列表的函數
const getBranchesList = async () => {
  let success = false;

  const sql = `
    SELECT *
    FROM branches
    ORDER BY branch_id DESC
  `;

  try {
    const [rows] = await db.query(sql);
    success = true;
    return {
      success,
      branches: rows,
    };
  } catch (err) {
    console.error("Error fetching branches:", err);
    return { success };
  }
};

// 主题列表的路由
router.get("/", async (req, res) => {
  const branchId = req.query.branch_id; // 從查詢參數中獲取分店ID
  const data = await getThemesList(branchId);
  if (!data.success) {
    return res.json({
      status: "error",
      message: "無法查詢到主題資料",
    });
  }

  return res.json({
    status: "success",
    themes: data.themes,
  });
});

// 第二個主題列表的路由
router.get("/second", async (req, res) => {
  const data = await getSecondThemesList();
  if (!data.success) {
    return res.json({
      status: "error",
      message: "無法查詢到第二個分店主題資料",
    });
  }

  return res.json({
    status: "success",
    themes: data.themes,
  });
});

// 分店列表的路由
router.get("/branches", async (req, res) => {
  const data = await getBranchesList();
  if (!data.success) {
    return res.status(500).json({
      status: "error",
      message: "無法查詢到分店資料",
    });
  }

  return res.json({
    status: "success",
    branches: data.branches,
  });
});

// 分店主題列表的路由
router.get("/branch-themes", async (req, res) => {
  const data = await getBranchThemesList();
  if (!data.success) {
    return res.status(500).json({
      status: "error",
      message: "無法查詢到分店主題資料",
    });
  }

  return res.json({
    status: "success",
    branch_themes: data.branch_themes,
  });
});

// 圖片
router.get("/img/:theme_id", async (req, res) => {
  try {
    const data = await getImg(req);
    console.log(req.params.theme_id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "/img/:theme_id出錯了" });
  }
});

// 取得用戶資料
router.get("/api/member_profile", async (req, res) => {
  // 從 query 中取得 member_id, order_status_id
  const { member_id } = req.query;

  try {
    const sql = `
      SELECT
        name,
        mobile_phone

      FROM users
      WHERE user_id =  ?;
    `;

    const [rows] = await db.query(sql, [member_id]);

    console.log("member profile: ", rows);

    res.json({
      status: true,
      rows,
    });
  } catch (error) {
    console.error("Error fetching member profile: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//----------------------------------------------
// 日曆
router.get("/calendar", async (req, res) => {
  console.log("收到的請求參數：", req.query);

  let { year, month, branch_themes_id } = req.query;

  // 參數驗證
  if (!year || !month || !branch_themes_id) {
    return res.status(400).json({ error: "缺少必要參數" });
  }

  // 確保年份、月份和branch_themes_id是數字
  year = parseInt(year, 10);
  month = parseInt(month, 10);
  branch_themes_id = parseInt(branch_themes_id, 10);

  if (
    isNaN(year) ||
    isNaN(month) ||
    month < 1 ||
    month > 12 ||
    isNaN(branch_themes_id)
  ) {
    return res.status(400).json({ error: "無效的參數" });
  }

  // 將月份轉換為兩位數的字符串
  const monthString = month.toString().padStart(2, "0");

  try {
    // 獲取特定branch_themes的theme_id
    const [themeResult] = await db.query(
      "SELECT theme_id FROM branch_themes WHERE branch_themes_id = ?",
      [branch_themes_id]
    );

    if (themeResult.length === 0) {
      return res.status(404).json({ error: "未找到指定的branch_themes_id" });
    }

    const theme_id = themeResult[0].theme_id;

    // 獲取預約數據，使用 CONVERT_TZ 函數來處理時區
    const reservationsSql = `
      SELECT 
        DATE(CONVERT_TZ(r.reservation_date, '+00:00', '+08:00')) AS date,
        COUNT(DISTINCT r.session_id) AS reserved_sessions
      FROM 
        reservations r
      WHERE 
        DATE(CONVERT_TZ(r.reservation_date, '+00:00', '+08:00')) >= ? AND 
        DATE(CONVERT_TZ(r.reservation_date, '+00:00', '+08:00')) < ? AND
        r.branch_themes_id = ? AND
        r.cancel = 0 AND
        r.reservation_status_id != 3
      GROUP BY 
        DATE(CONVERT_TZ(r.reservation_date, '+00:00', '+08:00'))
    `;

    // 獲取總會話數
    const sessionsSql = `
      SELECT 
        COUNT(DISTINCT s.sessions_id) AS total_sessions
      FROM 
        sessions s
      WHERE 
        s.theme_id = ?
    `;

    const startDate = moment
      .tz(`${year}-${monthString}-01`, "Asia/Taipei")
      .format("YYYY-MM-DD");
    const endDate = moment
      .tz(`${year}-${monthString}-01`, "Asia/Taipei")
      .endOf("month")
      .format("YYYY-MM-DD");

    const [reservations] = await db.query(reservationsSql, [
      startDate,
      endDate,
      branch_themes_id,
    ]);
    const [sessions] = await db.query(sessionsSql, [theme_id]);

    console.log("預約數據：", reservations);
    console.log("會話數據：", sessions);

    const totalSessionsPerDay = sessions[0].total_sessions;

    const calendarData = {};
    const daysInMonth = moment
      .tz(`${year}-${monthString}-01`, "Asia/Taipei")
      .daysInMonth();

    // 初始化每天的數據
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = moment
        .tz(
          `${year}-${monthString}-${day.toString().padStart(2, "0")}`,
          "Asia/Taipei"
        )
        .format("YYYY-MM-DD");
      calendarData[dateString] = {
        total_sessions: totalSessionsPerDay,
        reserved_sessions: 0,
        status: "open",
      };
    }

    // 填充預訂數據並計算狀態
    reservations.forEach((row) => {
      const dateString = moment
        .tz(row.date, "Asia/Taipei")
        .format("YYYY-MM-DD");
      if (calendarData[dateString]) {
        calendarData[dateString].reserved_sessions = row.reserved_sessions;
        if (row.reserved_sessions >= calendarData[dateString].total_sessions) {
          calendarData[dateString].status = "full";
        } else if (row.reserved_sessions > 0) {
          calendarData[dateString].status = "partial";
        }
      }
    });

    console.log("最終日曆數據：", JSON.stringify(calendarData, null, 2));

    res.json(calendarData);
  } catch (error) {
    console.error("獲取日曆數據時出錯：", error);
    res.status(500).json({ error: "內部服務器錯誤", details: error.message });
  }
});

router.get("/sessions-status", async (req, res) => {
  const { date, branch_themes_id } = req.query;

  try {
    const query = `
      SELECT 
        s.sessions_id,
        s.start_time,
        s.end_time,
        CASE WHEN r.reservation_id IS NOT NULL THEN 1 ELSE 0 END AS is_booked
      FROM sessions s
      JOIN branch_themes bt ON s.theme_id = bt.theme_id
      LEFT JOIN reservations r ON s.sessions_id = r.session_id 
        AND r.reservation_date = ? 
        AND r.branch_themes_id = ?
        AND r.reservation_status_id = 1
        AND r.cancel = 0
      WHERE bt.branch_themes_id = ?
      ORDER BY s.start_time
    `;

    const [rows] = await db.query(query, [
      date,
      branch_themes_id,
      branch_themes_id,
    ]);
    console.log("Query result:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching sessions status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------------------------------------------------------------

router.post("/api/reservations", async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const {
      user_id,
      branch_themes_id,
      reservation_date,
      session_id,
      participants,
      remark,
      coupon_name, // 新增：從請求中獲取優惠券名稱
    } = req.body;

    // 獲取主題的訂金金額
    const [themeRows] = await connection.query(
      `SELECT t.deposit, t.theme_name, b.branch_name
       FROM themes t 
       JOIN branch_themes bt ON t.theme_id = bt.theme_id 
       JOIN branches b ON bt.branch_id = b.branch_id
       WHERE bt.branch_themes_id = ?`,
      [branch_themes_id]
    );

    if (themeRows.length === 0) {
      throw new Error("未找到對應的主題");
    }

    const { deposit, theme_name, branch_name } = themeRows[0];

    // 插入預約數據
    const [result] = await connection.query(
      "INSERT INTO reservations (user_id, branch_themes_id, reservation_date, session_id, participants, remark) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user_id,
        branch_themes_id,
        reservation_date,
        session_id,
        participants,
        remark,
      ]
    );

    const reservation_id = result.insertId;

    // 處理優惠券
    let appliedCoupon = null;
    if (coupon_name) {
      const [coupon] = await connection.query(
        "SELECT id, discount_amount, discount_percentage FROM coupons WHERE coupon_name = ? AND valid_until >= CURDATE()",
        [coupon_name]
      );

      if (coupon.length > 0) {
        await connection.query(
          "INSERT INTO user_coupons (user_id, coupon_id, reservation_id) VALUES (?, ?, ?)",
          [user_id, coupon[0].id, reservation_id]
        );
        appliedCoupon = coupon[0];
      }
    }

    await connection.commit();

    const responseData = {
      success: true,
      message: "預約創建成功",
      reservation_id: reservation_id,
      deposit: deposit,
      theme_name: theme_name,
      branch_name: branch_name,
    };

    if (appliedCoupon) {
      responseData.appliedCoupon = {
        name: coupon_name,
        discount_amount: appliedCoupon.discount_amount,
        discount_percentage: appliedCoupon.discount_percentage,
      };
    }

    res.status(201).json(responseData);
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("創建預約失敗:", error);
    res.status(500).json({
      success: false,
      message: "創建預約失敗",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
});
export default router;
