import { TOTP, Secret } from "otpauth";
import QRCode from "qrcode";

// 忘記密碼產生 otp 驗證碼
export const generateOtp = (email = "") => {
  let otp = new TOTP({
    issuer: "knock2-project",
    label: email,
    algorithm: "SHA1",
    // 長度
    digits: 6,
    // 時效 分鐘
    period: 10,
    secret: Secret.fromLatin1(email + process.env.OTP_SECRET),
  });
  return otp.generate();
};

// 產生 Google Authenticator 驗證金鑰
export const generateGoogleAuthOtp = async (email = "") => {
  try {
    const secretString = email + process.env.OTP_SECRET;

    let otp = new TOTP({
      issuer: "knock2-project",
      label: email,
      algorithm: "SHA1",
      digits: 6,
      period: 30, // 30 秒
      secret: Secret.fromLatin1(secretString),
    });

    return {
      secret: otp.secret.base32,
      uri: otp.toString(),
    };
  } catch (ex) {
    console.error(ex);
  }
};

// 生成 QRCode
export const generateQRCode = async (uri) => {
  return await QRCode.toDataURL(uri);
};

// 驗證 otp

export const verifyGoogleAuthOtp = (token, totp_secret, account) => {
  const otp = new TOTP({
    issuer: "knock2-project",
    label: account,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(totp_secret),
  });
  const delta = otp.validate({ token, window: 1 });
  return delta !== null;
};
