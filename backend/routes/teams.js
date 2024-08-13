import express from "express";
import moment from "moment-timezone";
import db from "../utils/connect-mysql.js";
import { getIdParam } from "../utils/db-tool.js"

const router = express.Router();

// 有搜尋的所有團隊紀錄

const searchData = async (req) => {
  let success = false;
  let redirect = "";

  const perPage = 6;
  let page = parseInt(req.query.page) || 1;

  if (page < 1) {
    redirect = "?page=1";
    return { success, redirect };
  }

  //搜尋排序
  let branch_id = req.query.branch_id || req.params.difficulty || "";
  let team_status = req.query.team_status || "";
  let difficulty = req.query.difficulty || req.params.difficulty || "";
  let teamSearch = req.query.team_id || req.params.team_id || "";
  let userSearch = req.query.user_id || req.params.user_id || "";
  let reservation_date = req.query.startdate || "";
  
  let sort = req.query.sort || "reservation_date";
  const order = req.query.order || "DESC";

  let where = " WHERE 1 ";
  let rows = [];

  if (userSearch) {
    const userSearch_esc = db.escape(`${userSearch}`);
    where += ` AND (u.user_id = ${userSearch_esc})`;
  }

  if (teamSearch) {
    const teamSearch_esc = db.escape(`${teamSearch}`);
    where += ` AND (team.team_id = ${teamSearch_esc})`;
  }

  if (difficulty) {
    const difficulty_esc = db.escape(`${difficulty}`);
    where += ` AND (t.difficulty = ${difficulty_esc})`;
  }
  if (branch_id && branch_id.trim() !== "") {
    const branch_id_esc = db.escape(`${branch_id}`);
    where += ` AND (b.branch_id = ${branch_id_esc})`;
  }

  if (team_status && team_status.trim() !== "") {
    const team_status_esc = db.escape(`${team_status}`);
    where += ` AND (team_status = ${team_status_esc})`;
  }

  const t_sql = `SELECT COUNT(1) totalRows 
FROM reservations r
JOIN branch_themes bt ON r.branch_themes_id = bt.branch_themes_id
JOIN themes t ON bt.theme_id = t.theme_id
JOIN users u ON r.user_id = u.user_id
JOIN sessions s ON r.session_id = s.sessions_id
JOIN teams_list team ON team.r_id = reservation_id
JOIN branches b ON bt.branch_id = b.branch_id
${where}`;
  console.log(t_sql);
  const [[{ totalRows }]] = await db.query(t_sql);

  
  let totalPages = 0;

  if (totalRows) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      redirect = `?page=${totalPages}`;
      return { success, redirect };
    }

    //  reservation_id, r.user_id, nick_name, team_id, team_title, 
//  b.branch_id, branch_name, 
//  theme_name, difficulty, max_players, reservation_date, s.start_time, theme_img, s.theme_Time, team_status, team_limit 

  const sql = `SELECT reservation_id, r.user_id, nick_name, team_id, team_title, 
 b.branch_id, b.branch_name, team_limit, max_players,
 t.theme_name, t.difficulty, t.max_players, r.reservation_date, s.start_time, theme_img, s.theme_Time, team_status, team_limit 
  FROM reservations r
  JOIN branch_themes bt ON r.branch_themes_id = bt.branch_themes_id
  JOIN branches b ON bt.branch_id = b.branch_id
  JOIN themes t ON bt.theme_id = t.theme_id
  JOIN teams_list team ON team.r_id = reservation_id
  JOIN users u ON r.user_id = u.user_id
  JOIN sessions s ON r.session_id = s.sessions_id
  ${where} 
  ORDER BY ${sort} ${order}
  LIMIT ${(page - 1) * perPage},${perPage}`;

  [rows] = await db.query(sql);
  success = true;

}
  return {
    success,
    perPage,
    page,
    totalRows,
    totalPages,
    rows,
    qs: req.query,
  };
};

router.get("/teamSearch/", async (req, res) => {
  const data = await searchData(req);
  res.json(data);
});

router.get("/teamSearch/user/lead_team_:user_id", async (req, res) => {
  const data = await searchData(req);
  res.json(data);
});

router.get("/teamSearch/team/:team_id", async (req, res) => {
  const team_id = +req.params.team_id || 0;
  if (!team_id) {
    return res.json({ success: false, error: "沒有編號" });
  }});


// 取得還沒開團的資料
const noTeamData = async (req) => {
  let success = false;

  let user_id = req.params.user_id || "";
  let where = "";
  let rows = [];

  if (user_id && user_id.trim() !== "") {
    const user_id_esc = db.escape(`${user_id}`);
    where += ` AND (u.user_id = ${user_id})`;
  }

  const sql =`SELECT reservation_id, team_id, team_title, theme_name, b.branch_id, difficulty, u.user_id, nick_name, branch_name, 
  reservation_date, s.start_time , theme_img, s.theme_Time, team_status, team_limit
  FROM reservations r
  JOIN \`branch_themes\` bt ON r.branch_themes_id = bt.branch_themes_id
  JOIN \`branches\` b ON bt.branch_id = b.branch_id
  JOIN \`themes\` t ON bt.theme_id = t.theme_id
  LEFT JOIN \`teams_list\` team ON r_id = reservation_id
  JOIN \`users\` u ON r.user_id = u.user_id
  JOIN \`sessions\` s ON r.session_id = s.sessions_id
  WHERE team_id IS NULL ${where}
  ORDER BY reservation_date DESC`;

// const [rows] = await db.query(sql);
  [rows] = await db.query(sql);

  if (rows.length > 0) {
    success = true;
  } else {
    // 如果沒有資料，返回一個特定訊息
    rows = [{ message: 'No data found' }];
  }

return {
  success,
  rows,
  qs: req.query,
}
}

router.get("/api/res_team_:user_id", async (req, res) => {
  const data = await noTeamData(req)
  res.json(data);

  })

//--分隔線

// 取得單項資料的 API
router.get("/api/team_info_:team_id", async (req, res) => {
  const team_id = +req.params.team_id || 0;
  if (!team_id) {
    return res.json({ success: false, error: "沒有編號" });
  }

  // reservation_id, team_id, u.user_id, team_note, team_title, theme_name, difficulty, nick_name,
  // branch_name, reservation_date, s.start_time, theme_img, s.theme_Time, avatar
  const sql = `SELECT reservation_id, team_id, u.user_id, nick_name, avatar,bt.theme_id,team_note, team_title, theme_name, difficulty,
              branch_name, reservation_date, s.start_time, theme_img, s.theme_Time, theme_desc,  team_limit, team_status
  FROM reservations r
  JOIN \`branch_themes\` bt ON r.branch_themes_id = bt.branch_themes_id
  JOIN \`branches\` b ON bt.branch_id = b.branch_id
  JOIN \`themes\` t ON bt.theme_id = t.theme_id
  JOIN \`teams_list\` team ON r_id = reservation_id
  JOIN \`users\` u ON r.user_id = u.user_id
  JOIN \`sessions\` s ON r.session_id = s.sessions_id
  WHERE team_id=${team_id}`;

  const [rows] = await db.query(sql);

  if (!rows.length) {
    // 沒有該筆資料
    return res.json({ success: false, error: "沒有該筆資料" });
  }

  res.json({ success: true, data: rows[0] });
});

//--分隔線

// 取得留言資料的 API
router.get("/api/chat/get_chat_at_:team_id", async (req, res) => {
  const team_id = +req.params.team_id || 0;
  if (!team_id) {
    return res.json({ success: false, error: "沒有編號" });
  }

  const sql =`SELECT chat_id, nick_name, avatar, chat_text, create_at 
FROM \`teams_chats\` 
JOIN \`users\` ON chat_by = user_id
WHERE chat_at = ${team_id} AND chat_display = 1
ORDER BY create_at ASC`;

//  `SELECT nick_name, chat_text, chat_display, create_at, avatar
//   FROM teams_chats
//   JOIN \`users\` ON chat_by = user_id
//   WHERE chat_at=${team_id}`;

  const [rows] = await db.query(sql);

  if (!rows.length) {
    // 沒有留言記錄
    return res.json({ success: false, error: "此隊伍沒有留言記錄" });
  }

  res.json({ success: true, data: rows });
});


// 搜尋使用者帶領哪些團隊的API
  const sqlLead = `
  SELECT team_id, team_title, t.theme_name, team_limit, r.reservation_date, s.start_time, team_status
  FROM reservations r
  JOIN branch_themes bt ON r.branch_themes_id = bt.branch_themes_id
  JOIN branches b ON bt.branch_id = b.branch_id
  JOIN themes t ON bt.theme_id = t.theme_id
  JOIN teams_list team ON team.r_id = reservation_id
  JOIN users u ON r.user_id = u.user_id
  JOIN sessions s ON r.session_id = s.sessions_id
  WHERE r.user_id = ?`;

  const sqlLeadRecruiting = `${sqlLead} AND team_status = "募集中"`;
  const sqlLeadFormed =`${sqlLead} AND team_status = "已成團"`;

  router.get("/api/user_lead_team_:user_id", async (req, res) => {
    const user_id = +req.params.user_id || 0;
    if (!user_id) {
      return res.json({ success: false, error: "沒有編號" });
    }
  
  try {
    const [recruitingRows] = await db.query(sqlLeadRecruiting, [user_id]);
    const [formedRows] = await db.query(sqlLeadFormed, [user_id]);

    res.json({
      success: true,
      recruiting: recruitingRows,
      formed: formedRows
    });
  } catch (error) {
    res.json({ success: false, error: "資料庫查詢失敗" });
  }
});

// 搜尋使用者加入哪些團隊的API
const sqlJoin = `
SELECT team_id , team_title, t.theme_name, team_limit, r.reservation_date, s.start_time, team_status
FROM teams_members
JOIN teams_list team on join_team_id = team_id
JOIN reservations r ON r_id = reservation_id
JOIN branch_themes bt ON r.branch_themes_id = bt.branch_themes_id
JOIN branches b ON bt.branch_id = b.branch_id
JOIN themes t ON bt.theme_id = t.theme_id
JOIN sessions s ON r.session_id = s.sessions_id
WHERE join_user_id = ?`;

const sqlJoinRecruiting = `${sqlJoin} AND team_status = "募集中"`;
const sqlJoinFormed =`${sqlJoin} AND team_status = "已成團"`;

  router.get("/api/user_join_team_:user_id", async (req, res) => {
    const user_id = +req.params.user_id || 0;
    if (!user_id) {
      return res.json({ success: false, error: "沒有編號" });
    }
  
  try {
    const [recruitingRows] = await db.query(sqlJoinRecruiting, [user_id]);
    const [formedRows] = await db.query(sqlJoinFormed, [user_id]);

    res.json({
      success: true,
      recruiting: recruitingRows,
      formed: formedRows
    });
  } catch (error) {
    res.json({ success: false, error: "資料庫查詢失敗" });
  }
});

//

//計算隊員的API
router.get("/api/all_member", async (req, res) => {

  const sql =`SELECT no, join_team_id, join_user_id
FROM teams_members`;

  const [rows] = await db.query(sql);

  if (!rows.length) {
    // 沒有該筆資料
    return res.json({ success: false, error: "此隊伍還沒有人申請加入" });
  }

  res.json({ success: true, members: rows.length ,data: rows });
});

// 搜尋隊伍有多少人加入的API
router.get("/api/team_member_at_:team_id", async (req, res) => {
  const team_id = +req.params.team_id || 0;
  if (!team_id) {
    return res.json({ success: false, error: "沒有編號" });
  }

  const sql =`SELECT no, join_team_id, join_user_id, nick_name, avatar, m_status
FROM \`teams_members\` tm
JOIN \`users\` ON join_user_id = user_id
JOIN \`teams_list\` ON join_team_id = team_id
WHERE join_team_id = ${team_id}
ORDER BY tm.create_at DESC`;

  const [rows] = await db.query(sql);

  if (!rows.length) {
    // 沒有該筆資料
    return res.json({ success: false, error: "此隊伍還沒有人申請加入" });
  }

  res.json({ success: true, members: rows.length ,data: rows });
});

// 管理團員的API
router.post("/api/manage_member", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    result: {},
  };
 
  let members = req.body;

  if (members.length === 0) {
    output.error = "No members to update";
    return res.json(output);
  }

  try {
    let sql = "UPDATE `teams_members` SET `m_status` = CASE `no` ";
    const values = [];
    members.forEach(member => {
      sql += `WHEN ? THEN ? `;
      values.push(member.no, member.m_status);
    });
    sql += "END, `last_modified_at` = NOW() WHERE `no` IN (";
    sql += members.map(() => "?").join(", ");
    sql += ")";
    members.forEach(member => {
      values.push(member.no);
    });

    const [result] = await db.query(sql, values);

  output.success = true;
  output.result = result;  
}catch (ex) {
    output.error = ex.message;
  }

  res.json(output);
});

// 團隊成團的API
router.post("/api/team_start", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    result: {},
  };

  // let body = { ...req.body };
  // body.last_modified_at = new Date();

  const { team_id } = req.body;
  try {
  const sql = "UPDATE `teams_list` SET `team_status` = '已成團', `last_modified_at` = NOW() WHERE `team_id` = ?";
  const [result] = await db.query(sql, [team_id]);

  if (result.affectedRows > 0) {
    output.success = true;
    output.result = result;
  } else {
    output.error = '更新失敗，找不到對應的 team_id';
  }
  }catch (ex) {
    output.error = ex.message;
  }

  res.json(output);
});


// 新增留言的API
router.post("/api/chat/add", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    result: {},
  };

  let body = { ...req.body };
  body.create_at = new Date();

  const { chat_at, chat_by, chat_text } = body;
  try {
  const sql = "INSERT INTO `teams_chats` (`chat_at`, `chat_by`, `chat_text`, `create_at`) VALUES (?, ?, ?, ?)";
  const [result] = await db.query(sql, [chat_at, chat_by, chat_text, body.create_at]);

  }catch (ex) {
    output.error = ex.message;
  }

  res.json(output);
});


// 申請加入團隊的API
router.post("/api/team_join/add", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    result: {},
  };

  let body = { ...req.body };
  body.create_at = new Date();

  const { join_team_id, join_user_id } = body;
  try {
  const sql = "INSERT INTO `teams_members` (`join_team_id`, `join_user_id`, `create_at`, `last_modified_at`, `m_status`) VALUES (?, ?, now(), now(), 0)";
  const [result] = await db.query(sql, [join_team_id, join_user_id]);

  if (result.affectedRows === 1) {
    output.success = true;
    output.result = result;
  } else {
    output.error = "加入團隊失敗";
  }
} catch (ex) {
    output.error = ex.message;
  }
  res.json(output);
});



// 準備揪團的API
const createTeam = async (req) => {
  let success = false;

  const r_id = +req.params.rid || 0;
  let rows = [];

  if (!r_id) {
    return res.json({ success: false, error: "沒有編號" });
  }

  const sql =`SELECT reservation_id, theme_name, b.branch_id, u.user_id, nick_name, branch_name, participants,
  reservation_date, s.start_time, s.end_time , theme_img, s.theme_Time
  FROM reservations r
  JOIN \`branch_themes\` bt ON r.branch_themes_id = bt.branch_themes_id
  JOIN \`branches\` b ON bt.branch_id = b.branch_id
  JOIN \`themes\` t ON bt.theme_id = t.theme_id
  JOIN \`users\` u ON r.user_id = u.user_id
  JOIN \`sessions\` s ON r.session_id = s.sessions_id
  WHERE reservation_id = ${r_id}`;


  [rows] = await db.query(sql);

  if (rows.length > 0) {
    success = true;
  } else {
    // 如果沒有資料，返回一個特定訊息
    rows = [{ message: 'No data found' }];
  }

return {
  success:true,
  rows,
  qs: req.query,
}
}
  router.get("/api/create_rid_:rid", async (req, res) => {
    const data = await createTeam(req)
    res.json(data);
})

// 新增揪團的API
router.post("/api/create_team/", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    result: {},
  };

  // let body = { ...req.body };
  const { reservation_id, team_title, team_limit, team_note } = req.body;
  try {
  const sql = "INSERT INTO `teams_list` (`r_id`, `team_title`, `team_limit`, `team_note`, `create_at`, `last_modified_at`) VALUES (?, ?, ?, ?, now(), now())";

  // const [result] = await db.query(sql);
  const [result] = await db.query(sql, [reservation_id, team_title, team_limit, team_note]);
  if (result.affectedRows === 1) {
    output.success = true;
    output.result = result;
  } else {
    output.error = "建立資料失敗";
  }

  }catch (ex) {
    output.error = ex.message;
  }

  res.json(output);
});



export default router;

