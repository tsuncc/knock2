// 這個檔案為 email 設定黨

import nodemailer from 'nodemailer'

// 定義所有email的寄送伺服器位置
let transport = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use TLS
  // env 變數
  auth: {
    user: process.env.SMTP_TO_EMAIL,
    pass: process.env.SMTP_TO_PASSWORD,
  },
  tls: {
    servername: 'smtp.gmail.com',
    rejectUnauthorized: false,
  },
}

// 呼叫transport函式
const transporter = nodemailer.createTransport(transport)

// 驗証連線設定
transporter.verify((error, success) => {
  if (error) {
    // 發生錯誤
    console.error(
      'WARN - 無法連線至SMTP伺服器 Unable to connect to the SMTP server.'
        .bgYellow
    )
  } else {
    // 代表成功
    console.log('INFO - SMTP伺服器已連線 SMTP server connected.')
  }
})

export default transporter
