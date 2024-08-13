export const mailHtml = (nick_name, otpLink) => {
  return `
      <section
      style="
        width: 60%;
        min-width: 300px;
        max-width: 550px;
        text-align: center;
        font-size: 16px;
        margin: auto;
        background-color: #212429;
        color: #ffffff;
        padding: 30px;
        border-radius: 12px;
        font-family: Arial, sans-serif, 'Motiva Sans';
      "
    >
      <h1
        style="
          font-size: 36px;
          line-height: 42px;
          text-align: left;
          color: #bfbfbf;
          font-weight: bold;
        "
      >
        ${nick_name} ，您好
      </h1>
      <table style="text-align: left; width: 100%">
        <tr>
          <td><p>您收到這封郵件是因為您申請了密碼重置。</p></td>
        </tr>
        <tr>
          <td>
            <h2
              style="
                font-size: 28px;
                line-height: 36px;
                text-align: left;
                color: #ffffff;
              "
            >
              請使用下方連結完成密碼重置流程：
            </h2>
          </td>
        </tr>
        <tr>
          <td>
            <div
              style="
                width: 100%;
                padding: 34px 0;
                border-radius: 12px;
                text-align: center;
              "
            >
              <a
                href="${otpLink}"
                style="
                  font-size: 18px;
                  line-height: 22px;
                  text-align: center;
                  border-radius: 5px;
                  letter-spacing: 2px;
                  background: linear-gradient(90deg, #b99755 0%, #4a3711 100%);
                  color: #ffffff;
                  text-transform: uppercase;
                  padding: 12px 80px;
                  text-decoration: none;
                "
              >
                <span style="text-decoration: none; color: #f1f1f1"
                  >重置密碼</span
                >
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <p>連結將在 10 分鐘 內有效。請勿將連結提供給他人。</p>
          </td>
        </tr>
        <tr>
          <td>
            <p>如果不是您本人操作，請忽略此郵件，您的帳號仍然是安全的。</p>
          </td>
        </tr>
        <tr>
          <td><p>感謝您的使用！</p></td>
        </tr>
        <tr>
          <td><p>祝您順利</p></td>
        </tr>
        <tr>
          <td>
            <table>
              <tr>
                <td>
                  <h3 style="color: #bfbfbf; font-weight: bold">
                    悄瞧 knock knock 團隊
                  </h3>
                </td>
                <td>
                  <img
                    src="cid:logo@nodemailer.com"
                    alt="logo"
                    style="width: 50px"
                  />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </section>
  `;
};
