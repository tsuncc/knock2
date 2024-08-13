import express from "express";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../utils/connect.js";
import upload from "../../utils/upload-avatar.js";
import schemaForm from "./schema-profile.js";
import transporter from "../../configs/mail.js";
import { createOtp } from "./createOtp.js";
import { mailHtml } from "./mail-html.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  generateGoogleAuthOtp,
  generateQRCode,
  verifyGoogleAuthOtp,
} from "../../configs/otp.js";
import { sendNotificationToUser } from "../notifications.js";

const dateFormat = "YYYY-MM-DD";
const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
const router = express.Router();

// // 模擬網路延遲的狀況 middleware
// router.use((req, res, next) => {
//   const ms = 100 + Math.floor(Math.random() * 2000);
//   setTimeout(() => {
//     next();
//   }, ms);
// });

// 用id提取email帳號
const getUserData = async (user_id) => {
  try {
    const sql = "SELECT * FROM users WHERE user_id=?";
    const [rows] = await db.query(sql, [user_id]);

    if (!rows.length) return;
    const userData = rows[0];
    return userData;
  } catch (ex) {
    return;
  }
};

// 登入功能
router.post("/login-jwt", upload.none(), async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: "",
    totp_enabled: false,
    data: {
      id: 0,
      nickname: "",
      avatar: "",
      token: "",
    },
  };

  const sql = "SELECT * FROM users WHERE account=?";
  const [rows] = await db.query(sql, [req.body.account]);

  if (!rows.length) {
    // 帳號是錯的
    output.code = 400;
    output.error = "帳號或密碼錯誤";
    return res.json(output);
  }

  const result = await bcrypt.compare(req.body.password, rows[0].password);
  if (!result) {
    // 密碼是錯的
    output.code = 420;
    output.error = "帳號或密碼錯誤";
    return res.json(output);
  }

  // 帳號密碼是否有驗證成功
  output.success = true;

  if (rows[0].totp_enabled) {
    // 如果有開啟2步驟驗證，通知前端讓用戶輸入驗證碼
    output.totp_enabled = true;
    output.data.id = rows[0].user_id;
  } else {
    // 如果沒2步驟驗證，可以直接給令牌
    const payload = {
      id: rows[0].user_id,
      account: rows[0].account,
    };
    const token = jwt.sign(payload, process.env.JWT_KEY);

    output.data = {
      id: rows[0].user_id,
      nickname: rows[0].nick_name,
      avatar: rows[0].avatar,
      token,
    };
    const dateTime = moment(new Date()).format(dateTimeFormat);
    sendNotificationToUser(output.data.id, `您在 ${dateTime} 登入成功`);
  }

  res.json(output);
});

// 登入時的 兩步驟驗證 Google Authenticator
router.post("/verify-otp", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: "",
    data: {
      id: 0,
      nickname: "",
      avatar: "",
      token: "",
    },
  };

  const { id, token } = req.body;

  if (!id || !token) {
    output.error = "缺少必要資訊";
    return res.status(500).json(output);
  }

  const { user_id, account, nick_name, avatar, totp_secret } =
    await getUserData(id);

  if (!account || !totp_secret) {
    output.error = "無法取得帳號資料或沒有申請過2步驟驗證";
    return res.status(500).json(output);
  }

  const isValid = verifyGoogleAuthOtp(token, totp_secret, account);

  if (!isValid) {
    output.error = "驗證失敗";
    return res.status(400).json(output);
  }

  // 如果驗證成功，給令牌

  const payload = {
    id: user_id,
    account: account,
  };
  const jwtToken = jwt.sign(payload, process.env.JWT_KEY);

  output.data = {
    id: user_id,
    nickname: nick_name,
    avatar: avatar,
    token: jwtToken,
  };
  const dateTime = moment(new Date()).format(dateTimeFormat);
  sendNotificationToUser(output.data.id, `您在 ${dateTime} 登入成功`);

  output.success = true;
  return res.json(output);
});

// 驗證 jwt token
router.post("/verify-token", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: "",
    data: {
      id: 0,
      nickname: "",
      avatar: "",
      token: "",
    },
  };

  if (!req.body.token) return res.json(output);

  let payload = {};

  try {
    payload = jwt.verify(req.body.token, process.env.JWT_KEY);
  } catch (ex) {
    // 如果 token 是無效的
    output.code = 400;
    output.error = "無效的 token";
    output.success = false;
    return res.json(output);
  }

  try {
    const sql = "SELECT user_id,nick_name,avatar FROM users WHERE user_id=?";
    const [rows] = await db.query(sql, [payload.id]);
    output.data = {
      id: rows[0].user_id,
      nickname: rows[0].nick_name,
      avatar: rows[0].avatar,
      token: req.body.token,
    };
  } catch (ex) {
    output.error = ex;
    output.success = false;
    return res.json(output);
  }

  output.success = true;
  res.json(output);
});

// 讀取profile-form資料的api
router.post("/api", async (req, res) => {
  const output = {
    success: false,
    error: 0,
    users: {},
  };

  if (!req.my_jwt?.id) {
    output.error = "沒登入";
    return res.json(output);
  }

  const id = +req.my_jwt?.id || 0;
  if (!id) {
    output.error = "找不到這筆資料";
    return res.json(output);
  }

  const sql1 = `SELECT account,totp_enabled,name,nick_name,gender,birthday,users.mobile_phone,invoice_carrier_id,tax_id,avatar 
  FROM users WHERE users.user_id = ${id}`;
  const [users] = await db.query(sql1);

  if (!users.length) {
    //沒有該筆資料
    output.error = "資料庫沒有這筆用戶";
    return res.json(output);
  }

  const m = moment(users[0].birthday);
  users[0].birthday = m.isValid() ? m.format(dateFormat) : "";

  const sql2 = `SELECT address.id,postal_codes,address,recipient_name, address.mobile_phone ,type, district.id AS district_id,district_name, city_id ,city_name 
  FROM address 
  LEFT JOIN district
  ON district_id = district.id 
  LEFT JOIN city
  ON city_id = city.id 
  WHERE user_id = ${id}`;
  const [address] = await db.query(sql2);

  output.success = true;
  output.users = users[0];
  if (address.length !== 0) {
    output.address = address;
  }
  res.json(output);
});

// 處理profile-form編輯的api
router.put("/api", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: "",
    result: {},
  };

  if (!req.my_jwt?.id) {
    output.error = "沒登入";
    return res.json(output);
  }

  const id = +req.my_jwt?.id || 0;
  if (!id) {
    output.error = "找不到這筆資料";
    return res.json(output);
  }

  // 表單驗證
  const result = schemaForm.safeParse(req.body.users);

  const newProfileFormErrors = {
    name: "",
    nick_name: "",
    birthday: "",
    mobile: "",
    invoice_carrier_id: "",
    tax_id: "",
  };

  if (!result.success) {
    output.error = "驗證未通過";
    return res.json(output); // 表單資料沒有驗證通過就直接返回
  }

  // 更新地址
  if (req.body.address) {
    let address_id = req.body.address.address_id;
    try {
      // 第一次地址全部洗成 0
      const sql_address_1 = "UPDATE `address` SET type = 0 WHERE user_id=? ";
      const [result1] = await db.query(sql_address_1, id);
      output.result_address_1 = result1;

      // 第二次指定address_id洗成1
      const sql_address_2 = "UPDATE `address` SET type = 1 WHERE id=? ";
      const [result2] = await db.query(sql_address_2, address_id);

      output.result_address_2 = result2;
      output.address_success = !!(result2.affectedRows && result2.changedRows);

      if (output.address_success) {
        output.address_error = "地址更新成功";
      } else {
        output.code = 103;
        output.address_error = "地址更新失敗2";
        return res.json(output);
      }
    } catch (ex) {
      output.code = 101;
      output.address_error = ex;
      return res.json(output);
    }
  }

  // 更新 user
  let users = { ...req.body.users };

  // 加入更新時間
  const last_modified_at = moment(new Date());
  users.last_modified_at = last_modified_at.isValid()
    ? last_modified_at.format(dateTimeFormat)
    : null;

  // 驗證 birthday 日期格式
  const birthday = moment(users.birthday); //用moment去驗證是否為空字串
  users.birthday = birthday.isValid() ? birthday.format(dateFormat) : null;

  // 寫入修改人員 0 = 會員
  users.last_modified_by = 0;

  try {
    const sql = "UPDATE `users` SET ? WHERE user_id=? ";
    const [result] = await db.query(sql, [users, id]);
    output.result = result;
    output.success = !!(result.affectedRows && result.changedRows);
  } catch (ex) {
    output.error = ex;
  }

  return res.json(output);
});

// 處理 地址city選項 的api
router.get("/address_city_options", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: "",
    city: {},
  };

  try {
    const sql = `SELECT id AS value , city_name AS text FROM city;`;
    const [rows] = await db.query(sql);
    output.city = rows;
  } catch (error) {
    console.error("Error fetching city: ", error);
    res.status(500).json(output);
  }

  output.success = true;
  res.json(output);
});

// 處理 地址district選項 的api
router.get("/address_district_options/:city_id", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: "",
    district: {},
  };

  const city_id = +req.params.city_id || 0;
  if (!city_id) {
    output.code = 400;
    output.error = "缺少 city id";
    return res.status(400).json(output);
  }

  try {
    const sql = `SELECT id AS value , district_name AS text FROM district WHERE city_id=?;`;
    const [rows] = await db.query(sql, [city_id]);
    output.district = rows;
  } catch (error) {
    console.error("Error fetching district: ", error);
    res.status(500).json(output);
  }

  output.success = true;
  res.json(output);
});

// 處理 地址更新 的api
router.post("/update_address", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: "",
    result: {},
  };
  if (!req.my_jwt?.id) {
    output.error = "沒登入";
    return res.json(output);
  }

  const address_id = req.body.id;
  try {
    if (!address_id) {
      const sql = "INSERT INTO address SET ?";
      const [result] = await db.query(sql, [req.body]);

      output.success = result.affectedRows;
      output.result = result;
    } else {
      const sql = "UPDATE address SET ? WHERE id=?";
      const [result] = await db.query(sql, [req.body, address_id]);

      output.success = result.affectedRows;
      output.result = result;
    }
  } catch (error) {
    output.error = error;
    res.status(500).json(output);
  }

  return res.json(output);
});

// 處理 刪除地址 的api
router.delete("/delete_address/:address_id", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: "",
    result: {},
  };
  if (!req.my_jwt?.id) {
    output.error = "沒登入";
    return res.json(output);
  }

  const address_id = +req.params.address_id || 0;

  if (!address_id) {
    output.code = 400;
    output.error = "缺少 address id";
    return res.status(400).json(output);
  }

  try {
    const sql = `DELETE FROM address WHERE id=?`;
    const [result] = await db.query(sql, [address_id]);

    if (result.affectedRows === 1) {
      output.success = true;
      output.result = result;
    } else {
      output.code = 404;
      output.error = "刪除失敗，找不到 address id";
    }

    res.status(200).json(output);
  } catch (error) {
    console.error("地址刪除失敗:", error);
    output.code = 500;
    output.message = error;
    res.status(500).json(output);
  }
});

// 處理 register 註冊的api
router.post("/register", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: "",
    result: {},
  };

  // 驗證 recaptcha 驗證碼
  try {
    const token = req.body.recaptchaToken;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
    const response = await fetch(url, { method: "POST" });
    const data = await response.json();
    if (!data.success) {
      output.code = 430;
      output.error = "你是機器人？ 重新請點選下方驗證";
      return res.json(output);
    }
  } catch (ex) {
    output.code = 430;
    output.error = "你是機器人？ (ReCAPTCHA驗證失敗)";
    return res.json(output);
  }

  // TODO 欄位資料的檢查

  let body = { ...req.body };
  delete body.recaptchaToken;
  body.password = await bcrypt.hash(body.password, 12);

  try {
    const sql = "INSERT INTO users SET ?";
    const [result] = await db.query(sql, [body]);
    output.success = true;
    output.result = result;
  } catch (ex) {
    output.code = 440;
    console.error(ex);
    if (ex.errno === 1062) {
      output.code = 450;
      output.error = "Email已被註冊，請試試其他Email";
    }
  }

  res.json(output);
});

// otp-mail 發送忘記密碼email的api
router.post("/otp-mail", async (req, res) => {
  const output = {
    success: false,
    error: "",
    data: {},
  };

  const { account } = req.body;

  const otpResult = await createOtp(account);

  if (!otpResult.success) {
    return res.json(otpResult);
  }

  const payload = {
    account: account,
    otp: otpResult.token,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY);
  const link = `http://localhost:3000/user/reset-password?t=${token}`;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // 寄送 email
  const mailOptions = {
    from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
    to: account,
    subject: "重置您的密碼 - 悄瞧 團隊",
    html: mailHtml(otpResult.nick_name, link),
    attachments: [
      {
        filename: "logo.png",
        path: join(__dirname, "./mail-img/logo.png"),
        cid: "logo@nodemailer.com",
      },
    ],
  };

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      output.success = false;
      output.error = err;
      return res.status(400).json(output);
    } else {
      output.success = true;
      return res.json(output);
    }
  });
});

// reset-password" 重設密碼email的api
router.post("/verify-otp-mail", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    user_id: 0,
    error: "",
  };

  const token = req.body.token;

  let payload = {};

  try {
    payload = jwt.verify(token, process.env.JWT_KEY);
  } catch (ex) {
    // 如果 token 是無效的
    output.code = 400;
    output.error = "無效的 token";
    return res.json(output);
  }
  // payload = { account: 'knockk2411@gmail.com', otp: '134753', iat: 1720577779 }
  const { account, otp } = payload;

  const sql = "SELECT user_id, token, exp_timestamp FROM otp WHERE account=?";
  const [[row]] = await db.query(sql, [account]);
  // row = { token: '134753', exp_timestamp: 1720578379113 } 已算上 10 分鐘

  if (!row) {
    output.code = 401;
    output.error = "沒有發送otp紀錄";
    return res.json(output);
  }

  if (payload.otp !== row.token || Date.now() > row.exp_timestamp) {
    // 如果傳來的otp跟資料庫不同 或 otp已經過期
    output.code = 403;
    output.error = "驗證碼不正確或已經過期";
    return res.json(output);
  }

  // 如果都通過檢查
  output.user_id = row.user_id;
  output.success = true;
  return res.json(output);
});

// reset-password" 重設密碼email的api
router.put("/reset-password", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: "",
  };

  const { old_password, new_password, user_id } = req.body.data;

  try {
    const sql = "SELECT password FROM users WHERE user_id=?";
    const [[row]] = await db.query(sql, [user_id]);
    if (req.body.isLogin) {
      // 如果有登入 - 驗證舊密碼是否正確
      const result = await bcrypt.compare(old_password, row.password);
      if (!result) {
        // 密碼是錯的
        output.code = 420;
        output.error = "舊密碼輸入錯誤，請重新輸入";
        return res.json(output);
      }
    } else {
      // 如果沒登入 - 驗證新密碼跟舊密碼是否相同
      const result = await bcrypt.compare(new_password, row.password);
      if (result) {
        // 密碼相同
        output.code = 421;
        output.error = "新密碼與舊密碼不能相同，請重新輸入";
        return res.json(output);
      }
    }
  } catch (ex) {
    output.code = 440;
    output.error = "找不到此筆帳號";
    return res.json(output);
  }

  // 舊密碼正確 或 忘記密碼 - 修改密碼
  const new_password_hash = await bcrypt.hash(new_password, 12);
  try {
    const sql = "UPDATE users SET password=? WHERE user_id=?";
    const [result] = await db.query(sql, [new_password_hash, user_id]);
    output.success = !!result.affectedRows;
  } catch (ex) {
    console.error(ex);
    output.code = 441;
    output.error = "無法更新密碼";
    return res.json(output);
  }

  if (!req.body.isLogin && output.success) {
    // 如果是登入且修改密碼成功 刪除otp紀錄
    try {
      const sql = "DELETE FROM otp WHERE user_id=?";
      await db.query(sql, [user_id]);
    } catch (ex) {
      console.error(ex);
    }
  }

  return res.json(output);
});

// google login 的api
router.post("/google-login", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    error: "",
    data: {
      id: 0,
      nickname: "",
      avatar: "",
      token: "",
    },
  };

  // 沒有google登入資料
  if (!req.body.providerId || !req.body.uid) {
    output.success = false;
    output.code = 400;
    output.error = "缺少google登入資料";
    return res.json(output);
  }

  const { displayName, email, uid, phoneNumber } = req.body;

  // 1. 先查詢資料庫是否有同google_uid的資料
  try {
    const sql_google_uid = "SELECT * FROM users WHERE google_uid=?";
    const [rows] = await db.query(sql_google_uid, [uid]);

    if (!rows.length) {
      //  2-1.不存在 -> 建立一個新會員資料(無帳號與密碼)，只有google來的資料 -> 執行登入工作
      const data = {
        account: email,
        name: displayName,
        nick_name: displayName,
        mobile_phone: phoneNumber,
        google_uid: uid,
      };
      try {
        const sql = "INSERT INTO users SET ?";
        const [result] = await db.query(sql, [data]);
        if (!result.affectedRows) {
          output.code = 441;
          output.error = "預期外的錯誤，請聯絡管理員";
          return res.json(output);
        }
      } catch (ex) {
        output.code = 440;
        output.error = "預期外的錯誤，請聯絡管理員";
        console.error(ex);
        if (ex.errno === 1062) {
          output.code = 450;
          output.error = "Email已被註冊，請試試其他Email";
        }
        return res.json(output);
      }
    }
  } catch (ex) {
    output.error = ex;
  }

  try {
    const sql_google_uid = "SELECT * FROM users WHERE google_uid=?";
    const [rows] = await db.query(sql_google_uid, [uid]);

    //  有存在 -> 執行登入工作
    output.success = true;
    const payload = {
      id: rows[0].user_id,
      account: rows[0].account,
    };
    const token = jwt.sign(payload, process.env.JWT_KEY);

    output.data = {
      id: rows[0].user_id,
      nickname: rows[0].nick_name,
      avatar: rows[0].avatar,
      token,
    };
  } catch (ex) {
    output.code = 460;
    output.error = "預期外的錯誤，請聯絡管理員";
    console.error(ex);
    return res.json(output);
  }

  // const dateTime = moment(new Date()).format(dateTimeFormat);
  // sendNotificationToUser(output.data.id, `您在 ${dateTime} 登入成功`);
  return res.json(output);
});

// 上傳 avatar 的api
router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  const output = {
    success: false,
    error: "",
    file: req.file,
  };
  if (!req.file) {
    output.error = "上傳失敗";
    return res.json(output);
  }

  try {
    const sql = "UPDATE users SET avatar=? WHERE user_id=?";
    const [result] = await db.query(sql, [req.file.filename, req.body.user_id]);
    output.success = !!result.affectedRows;
    if (!output.success) {
      output.error = "更新失敗";
      return res.json(output);
    }
  } catch (ex) {
    output.error = ex;
  }

  output.file = req.file;
  return res.json(output);
});

// 兩步驟驗證 Google Authenticator 取得 TOTP QRcode 的api
router.post("/2fa/request", async (req, res) => {
  const output = {
    success: false,
    error: "",
    qrCode: "",
    secret: "",
  };

  const user_id = req.body.id;

  const { account } = await getUserData(user_id);
  if (!account) {
    output.error = "無法取得帳號資料";
    return res.status(500).json(output);
  }

  // 生成 otp
  const { secret, uri } = await generateGoogleAuthOtp(account);

  try {
    // 生成 QRcode
    const qrCode = await generateQRCode(uri);
    if (!qrCode) {
      output.error = "無法生成 QRcode ，請重新再試一次1";
      return res.status(500).json(output);
    }
    output.qrCode = qrCode;
  } catch (error) {
    output.error = error;
    res.status(500).json(output);
  }

  try {
    // 將 secret 存儲到數據庫
    const sql = "UPDATE users SET totp_secret=? WHERE user_id=?";
    const [result] = await db.query(sql, [secret, user_id]);
    output.success = !!result.affectedRows;
    output.secret = secret;
    if (!result.affectedRows) {
      output.error = "更新失敗";
      return res.status(500).json(output);
    }
  } catch (ex) {
    output.error = ex;
    return res.status(500).json(output);
  }

  res.json(output);
});

// 兩步驟驗證 Google Authenticator 驗證 TOTP 並設定為已驗證的api
router.post("/2fa/verify-otp", async (req, res) => {
  const output = {
    success: false,
    error: "",
  };
  const { id, token } = req.body;

  if (!id || !token) {
    output.error = "缺少必要資訊";
    return output;
  }

  const { account, totp_secret } = await getUserData(id);
  if (!account || !totp_secret) {
    output.error = "無法取得帳號資料或沒有申請過2步驟驗證";
    return res.status(500).json(output);
  }

  const isValid = verifyGoogleAuthOtp(token, totp_secret, account);

  if (!isValid) {
    output.error = "驗證失敗";
    return res.status(400).json(output);
  }

  try {
    const sql = "UPDATE users SET totp_enabled=1 WHERE user_id=?";
    const [result] = await db.query(sql, id);
    output.success = !!result.affectedRows;
    if (!result.affectedRows) {
      output.error = "更新失敗";
      return res.status(500).json(output);
    }
  } catch (ex) {
    output.error = ex;
    return res.status(500).json(output);
  }

  return res.json(output);
});

// 解除資料庫的 2fa 驗證
router.post("/2fa/unset2fa", async (req, res) => {
  const { id } = req.body;
  try {
    const sql =
      "UPDATE users SET totp_enabled=0 , totp_secret=null WHERE user_id=?";
    const [result] = await db.query(sql, id);
    const output = {
      success: !!result.affectedRows,
    };
    return res.json(output);
  } catch (ex) {
    const output = {
      success: false,
      error: ex,
    };
    return res.status(500).json(output);
  }
});

export default router;
