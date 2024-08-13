import db from "../../utils/connect.js";
import moment from "moment-timezone";
import { generateOtp } from "../../configs/otp.js";

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

export const createOtp = async (account) => {
  const output = {
    success: false,
    nick_name: "",
    error: "",
    token: {},
  };

  // 先確認帳號是否存在
  const sqlUsers = `SELECT user_id, account, nick_name FROM users WHERE account = '${account}'`;
  const [users] = await db.query(sqlUsers);

  if (!users.length) {
    output.error = "此 Email 沒有註冊過";
    return output;
  }
  // return ////////////////////////////////////////////////////////////////////////////////////////////////////

  // 檢查資料庫中是否已經有 OTP 存在
  const sqlOtp = `SELECT * FROM otp WHERE account = '${account}'`;
  const [userOtp] = await db.query(sqlOtp);
  if (userOtp.length) {
    const now = new Date().getTime();
    const otpTimestamp = userOtp[0].exp_timestamp - 10 * 60 * 1000;

    if (!(now - otpTimestamp > 60 * 1000)) {
      // 1. 有 otp 且 60 秒內重新申請 不能產生 OTP (return)
      output.error = "需等候 60 秒才能再次請求新的驗證碼";
      return output;
    } else {
      // 2. 有 otp 但 60 秒已過 可以產生新的 OTP (update)
      const otpToken = generateOtp(account);
      const exp_timestamp = new Date().getTime() + 10 * 60 * 1000; // 10 分鐘過期時間
      const time = moment().format(dateTimeFormat);
      const newOtp = {
        token: otpToken,
        exp_timestamp: exp_timestamp,
        updated_at: time,
      };
      try {
        const sql = `UPDATE otp SET ? WHERE account = '${account}'`;
        const [result] = await db.query(sql, newOtp);
        output.success = !!result.affectedRows;
        output.token = otpToken;
        output.nick_name = users[0].nick_name;
      } catch (ex) {
        output.success = false;
        output.error = ex;
      }
      return output;
    }
  } else {
    // 3. 沒有 otp 可以產生 otp (generateOtp)
    const otpToken = generateOtp(account);
    const exp_timestamp = new Date().getTime() + 10 * 60 * 1000; // 10 分鐘過期時間
    const time = moment().format(dateTimeFormat);

    const newOtp = {
      user_id: users[0].user_id,
      account: account,
      token: otpToken,
      exp_timestamp: exp_timestamp,
      created_at: time,
      updated_at: time,
    };
    try {
      const sql = "INSERT INTO otp SET ?";
      const [result] = await db.query(sql, [newOtp]);

      output.success = !!result.affectedRows;
      output.token = otpToken;
      output.nick_name = users[0].nick_name;
    } catch (ex) {
      output.success = false;
      output.error = ex;
    }

    return output;
  }
};
