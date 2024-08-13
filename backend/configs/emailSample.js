// 這是 email 測試信的範例
import express from "express";
import transporter from "./mail.js";

const router = express.Router();
const user = "knockk2411@gmail.com";

// email內容
// from 不要更動，to 的地方放入變數寄給 user ( user 要自己修改變數，目前前端的登入state是沒有放email的，所以要先用id select users資料表)
// subject 是 email標題
// text 為文字內容，特殊字元一定要跳脫
// html 也可以改用HTML
const mailOptions = {
  from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
  to: user,
  subject: "這是一封測試電子郵件",
  text: `你好， \r\n這是一封測試信件。\r\n\r\n\r\n開發團隊 敬上`,
  html: "<p>用HTML也可以寫</p>"
};

// 因為 index 那邊沒有連結這個 emailSample 檔的路由，所以這裡是無法使用的，只是示範寫法
router.get("/send", function (req, res, next) {
  // 帶入 mailOptions 
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      return res.status(400).json({ status: "error", message: err });
    } else {
      return res.json({ status: "success" });
    }
  });
});

export default router;
