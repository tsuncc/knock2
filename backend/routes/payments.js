import express from "express";
import db from "../utils/connect.js";
import ecpay_payment from "ecpay_aio_nodejs";
import moment from "moment-timezone";
import axios from "axios";
import CryptoJS from "crypto-js";

const router = express.Router();
const API_URL = "https://einvoice-stage.ecpay.com.tw/B2CInvoice/Issue"; // 綠界發票 url
const {
  MERCHANTID,
  HASHKEY,
  HASHIV,
  MERCHANTID_INVOICE,
  HASHKEY_INVOICE,
  HASHIV_INVOICE,
  NGROK,
} = process.env;

const ngrok = `${NGROK}/payments`;

const options = {
  OperationMode: "Test",
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV,
  },
  IgnorePayment: [
    // "Credit",
    "WebATM",
    "ATM",
    "CVS",
    "BARCODE",
    "AndroidPay",
    "BNPL",
  ],
  IsProjectContractor: false,
};

let TradeNo;

// 訂單付款
router.get("/", async (req, res) => {
  const { orderId, checkoutTotal } = req.query;
  TradeNo = "KK" + new Date().getTime().toString();

  const now = new Date();
  const year = now.getFullYear();
  const month = `0${now.getMonth() + 1}`.slice(-2); // 月份需補0
  const day = `0${now.getDate()}`.slice(-2); // 日需補0
  const hour = `0${now.getHours()}`.slice(-2); // 小時需補0
  const minute = `0${now.getMinutes()}`.slice(-2); // 分鐘需補0
  const second = `0${now.getSeconds()}`.slice(-2); // 秒鐘需補0

  const MerchantTradeDate = `${year}/${month}/${day} ${hour}:${minute}:${second}`;

  try {
    const sql = `
      SELECT pm.product_name 
      FROM order_details od
      LEFT JOIN product_management pm ON pm.product_id = od.order_product_id
      WHERE od.order_id = ?;
    `;

    const [rows] = await db.query(sql, [orderId]);
    const productItemNames = rows.map((row) => row.product_name).join("#");

    const updateTradeNoSql = `
      UPDATE orders
      SET merchant_trade_no = ?
      WHERE id = ?
    `;

    const [tradeNoRow] = await db.query(updateTradeNoSql, [TradeNo, orderId]);

    const base_param = {
      MerchantTradeNo: TradeNo,
      MerchantTradeDate,
      PaymentType: "aio",
      TotalAmount: checkoutTotal,
      TradeDesc: "knock knock board game",
      ItemName: productItemNames,
      ReturnURL: `${ngrok}/return`,
      ChoosePayment: "Credit",
      EncryptType: 1,
      ClientBackURL: `http://localhost:3000/product?page=1`,
      OrderResultURL: `http://localhost:3000/checkout/success?order_id=${orderId}`,
      NeedExtraPaidInfo: "Y",
    };

    const create = new ecpay_payment(options);
    const html = await create.payment_client.aio_check_out_all(base_param);
    console.log("base_param, url", base_param, html);

    res.json({
      success: true,
      TradeNo: TradeNo,
      html,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ success: false, message: "Error creating payment" });
  }
});

// 訂單付款結果
router.post("/return", async (req, res) => {
  console.log("req.body:", req.body);
  const data = { ...req.body };
  const {
    CheckMacValue,
    RtnCode,
    PaymentDate,
    PaymentType,
    TradeNo,
    MerchantTradeNo,
  } = req.body;
  delete data.CheckMacValue; // 此段不驗證

  const create = new ecpay_payment(options);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data);
  // 轉換 TradeDate 為 MySQL datetime 格式

  const formatPaymentDate = moment(PaymentDate, "YYYY-MM-DD+HH:mm:ss")
    .tz("Asia/Taipei")
    .format("YYYY-MM-DD HH:mm:ss");

  console.log(
    "確認交易正確性：",
    CheckMacValue === checkValue,
    CheckMacValue,
    checkValue
  );

  if (CheckMacValue === checkValue) {
    const orderStatus = +RtnCode === 1 ? 2 : 1;
    // 更新資料庫
    const sql = `
      UPDATE orders
      SET rtn_code = ?, payment_date = ?, payment_type = ?, trade_no = ?, order_status_id = ?
      WHERE merchant_trade_no = ?;
    `;

    try {
      await db.query(sql, [
        RtnCode,
        formatPaymentDate,
        PaymentType,
        TradeNo,
        orderStatus,
        MerchantTradeNo,
      ]);

      // 當資料庫更新成功後，呼叫發票開立函式
      if (+RtnCode === 1) {
        await issueInvoice(MerchantTradeNo);
      }
      console.log("資料庫更新成功");
    } catch (error) {
      console.error("資料庫更新失敗:", error);
    }

    // 交易成功後，需要回傳 1|OK 給綠界
    res.send("1|OK");
  } else {
    console.log("比對失敗");
    res.status(400).send("比對失敗");
  }

  // // 交易成功後，需要回傳 1|OK 給綠界
  // if (CheckMacValue === checkValue) {
  //   res.send("1|OK");
  // } else {
  //   console.log("比對失敗");
  // }
});

// 行程付款
router.get("/reservation", async (req, res) => {
  const { reservation_id } = req.query;
  TradeNo = "KR" + new Date().getTime().toString();
  const MerchantTradeDate = new Date().toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Taipei",
  });

  try {
    const sql = `
      SELECT t.theme_name,
      t.deposit,
      b.branch_name
      FROM reservations r
      JOIN branch_themes bt ON bt.branch_themes_id = r.branch_themes_id
      JOIN themes t ON t.theme_id = bt.theme_id
      JOIN branches b ON b.branch_id = bt.branch_id
      WHERE r.reservation_id = ?;
    `;

    const [rows] = await db.query(sql, [reservation_id]);
    const ItemName = rows[0].theme_name;
    const TotalAmount = rows[0].deposit.toString();
    const TradeDesc = `悄瞧密室逃脫 / ${rows[0].branch_name}`;

    const updateTradeNoSql = `
      UPDATE reservations
      SET merchant_trade_no = ?
      WHERE reservation_id = ?
    `;

    const [tradeNoRow] = await db.query(updateTradeNoSql, [
      TradeNo,
      reservation_id,
    ]);

    const base_param = {
      MerchantTradeNo: TradeNo,
      MerchantTradeDate,
      PaymentType: "aio",
      TotalAmount: TotalAmount,
      TradeDesc: TradeDesc,
      ItemName: ItemName,
      ReturnURL: `${ngrok}/reservation/return`,
      ChoosePayment: "Credit",
      EncryptType: 1,
      ClientBackURL: `http://localhost:3000/themes`,
      OrderResultURL: `http://localhost:3000/checkout/reservation/${reservation_id}`,
      NeedExtraPaidInfo: "Y",
    };

    const create = new ecpay_payment(options);
    const html = await create.payment_client.aio_check_out_all(base_param);
    console.log("base_param, url", base_param, html);

    res.json({
      success: true,
      TradeNo: TradeNo,
      html,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ success: false, message: "Error creating payment" });
  }
});

// 行程付款結果
router.post("/reservation/return", async (req, res) => {
  console.log("req.body:", req.body);
  const data = { ...req.body };
  const {
    CheckMacValue,
    RtnCode,
    PaymentDate,
    PaymentType,
    TradeNo,
    MerchantTradeNo,
  } = req.body;
  delete data.CheckMacValue; // 此段不驗證

  const create = new ecpay_payment(options);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data);
  // 轉換 TradeDate 為 MySQL datetime 格式
  const formatPaymentDate = moment(PaymentDate, "YYYY-MM-DD+HH:mm:ss")
    .tz("Asia/Taipei")
    .format("YYYY-MM-DD HH:mm:ss");

  console.log(
    "確認交易正確性：",
    CheckMacValue === checkValue,
    CheckMacValue,
    checkValue
  );

  if (CheckMacValue === checkValue) {
    const statusId = +RtnCode === 1 ? 2 : 1;
    // 更新資料庫
    const sql = `
      UPDATE reservations
      SET rtn_code = ?, payment_date = ?, payment_type = ?, trade_no = ?, reservation_status_id = ?
      WHERE merchant_trade_no = ?;
    `;

    try {
      await db.query(sql, [
        RtnCode,
        formatPaymentDate,
        PaymentType,
        TradeNo,
        statusId,
        MerchantTradeNo,
      ]);
      console.log("資料庫更新成功");
    } catch (error) {
      console.error("資料庫更新失敗:", error);
    }

    // 交易成功後，需要回傳 1|OK 給綠界
    res.send("1|OK");
  } else {
    console.log("比對失敗");
    res.status(400).send("比對失敗");
  }

  // // 交易成功後，需要回傳 1|OK 給綠界
  // if (CheckMacValue === checkValue) {
  //   res.send("1|OK");
  // } else {
  //   console.log("比對失敗");
  // }
});

// 加密函數（發票用）
const encrypt = (text) => {
  const key = CryptoJS.enc.Utf8.parse(HASHKEY_INVOICE);
  const iv = CryptoJS.enc.Utf8.parse(HASHIV_INVOICE);
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return encrypted.toString();
};

// 解密函數（發票用）
const decrypt = (text) => {
  const key = CryptoJS.enc.Utf8.parse(HASHKEY_INVOICE);
  const iv = CryptoJS.enc.Utf8.parse(HASHIV_INVOICE);
  const decrypted = CryptoJS.AES.decrypt(text, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

let RelateNumber;

// 新增發票
const issueInvoice = async (merchant_trade_no) => {
  const { order, items } = await getOrderData(merchant_trade_no);

  if (order.rtn_code === 1) {
    RelateNumber = "KI" + new Date().getTime().toString();

    let carrierType = ""; //載具類別
    let print = "1"; // 是否列印
    let customerIdentifier = ""; // 統一編號
    let carrierNum = ""; // 載具編號

    //當統一編號[CustomerIdentifier]有值時
    // 2.a 載具類別[CarrierType]為空值時，此參數print請帶1
    // 2.b 載具類別[CarrierType]=1或2時，此參數print請帶0
    // 2.c 載具類別[CarrierType]=3時，此參數print可帶0或1

    if (order.recipient_invoice_carrier) {
      carrierType = "3"; // 綠界電子發票載具
      print = "0";
      customerIdentifier = "";
      carrierNum = order.recipient_invoice_carrier;
    }
    if (order.member_carrier === 1) {
      carrierType = ""; // 綠界電子發票載具
      print = "0";
      customerIdentifier = ""; // 統一編號
      carrierNum = "";
    }
    if (order.recipient_tax_id) {
      carrierType = ""; // 載具類別
      print = "1";
      customerIdentifier = order.recipient_tax_id; // 統一編號
      carrierNum = "";
    }

    try {
      const data = {
        MerchantID: MERCHANTID_INVOICE,
        RelateNumber: RelateNumber,
        CustomerID: order.member_id.toString(),
        CustomerIdentifier: customerIdentifier,
        CustomerName: order.name,
        CustomerAddr: order.full_address,
        CustomerPhone: order.recipient_mobile,
        CustomerEmail: order.account,
        Print: print,
        Donation: "0",
        CarrierType: carrierType,
        CarrierNum: carrierNum,
        TaxType: "1",
        SalesAmount: order.checkoutTotal,
        InvType: "07",
        Items: items,
      };

      const jsonData = JSON.stringify(data);
      const encodedData = encodeURIComponent(jsonData);
      const encryptedData = encrypt(encodedData);

      const requestData = {
        MerchantID: MERCHANTID_INVOICE,
        RqHeader: {
          Timestamp: Math.floor(Date.now() / 1000),
        },
        Data: encryptedData,
      };

      const response = await axios.post(API_URL, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const decryptedData = decrypt(response.data.Data);
      const decodedData = decodeURIComponent(decryptedData);
      const resultData = JSON.parse(decodedData);

      // 儲存發票資訊到數據庫
      await saveInvoiceToDatabase(merchant_trade_no, resultData);

      res.json({
        status: true,
        message: "Invoice issued and saved successfully",
        data: resultData,
        order_id: order_id,
      });

      console.log("invoice submit", data, "invoice result data", resultData);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Error adding invoice" });
    }
  } else {
    res.json({
      status: false,
      message: "尚未付款",
      order_id: order_id,
    });
  }
};

// 新增發票時須取得訂單資料
async function getOrderData(merchant_trade_no) {
  const orderSql = `
    SELECT
      o.id order_id,
      o.order_date,
      o.member_id,
      u.name,
      u.account,
      o.rtn_code,
      CONCAT(c.city_name, d.district_name, o.order_address) AS full_address,
      o.recipient_name,
      o.member_carrier,
      o.recipient_mobile,
      o.recipient_invoice_carrier,
      o.recipient_tax_id,
      o.deliver_fee,
      o.order_coupon_id coupon_id,
      coupons.discount_amount,
      coupons.discount_percentage,
      coupons.discount_max
      FROM orders o
      LEFT JOIN users u ON u.user_id = o.member_id
      LEFT JOIN district d ON d.id = o.order_district_id
      LEFT JOIN city c ON c.id = d.city_id
      LEFT JOIN order_details od ON od.order_id = o.id
      LEFT JOIN coupons ON coupons.id = o.order_coupon_id
    WHERE o.merchant_trade_no = ?
  `;

  const detailsSql = `
    SELECT
      od.order_id,
      o.merchant_trade_no,
      od.order_product_id,
      pm.product_name,
      od.order_unit_price,
      od.order_quantity,
      od.product_coupon_id,
      coupons.discount_amount,
      coupons.discount_percentage,
      coupons.discount_max
      FROM order_details od
      LEFT JOIN product_management pm ON pm.product_id = od.order_product_id
      LEFT JOIN orders o ON o.id = od.order_id
      LEFT JOIN coupons ON coupons.id = od.product_coupon_id
    WHERE o.merchant_trade_no = ?
  `;

  try {
    const [orderResult] = await db.query(orderSql, [merchant_trade_no]);
    const [detailsResult] = await db.query(detailsSql, [merchant_trade_no]);

    if (orderResult.length === 0) {
      throw new Error("Order not found");
    }

    const order = orderResult[0];

    let subtotal = 0;
    let productDiscount = 0;
    let orderDiscount = 0;
    let discountedProductOriginalTotal = 0;

    detailsResult.forEach((item) => {
      const total = item.order_quantity * item.order_unit_price;
      subtotal += total;
      if (item.discount_percentage) {
        const percentage = 1 - item.discount_percentage / 100;
        const discount = Math.floor(total * percentage);
        productDiscount +=
          discount >= item.discount_max ? item.discount_max : discount;
        discountedProductOriginalTotal += total;
      } else if (item.discount_amount) {
        productDiscount += item.discount_amount;
        discountedProductOriginalTotal += total;
      }
    });

    order.subtotal = subtotal;

    const excludeProductTotal = subtotal - discountedProductOriginalTotal;
    if (order.discount_percentage) {
      const percentage = 1 - order.discount_percentage / 100;
      const discount = Math.floor(excludeProductTotal * percentage);
      orderDiscount +=
        discount > order.discount_max ? order.discount_max : discount;
    }
    if (order.discount_amount) {
      orderDiscount = order.discount_amount;
    }

    const discountTotal = productDiscount + orderDiscount;

    order.checkoutTotal = subtotal + order.deliver_fee - discountTotal;

    let items = detailsResult.map((item, index) => ({
      ItemSeq: index + 1,
      ItemName: item.product_name,
      ItemCount: item.order_quantity,
      ItemWord: "個", // 或其他適當的單位
      ItemPrice: item.order_unit_price,
      ItemTaxType: "1", // 假設所有商品都是應稅
      ItemAmount: item.order_unit_price * item.order_quantity,
    }));

    // 添加運費項目（如果有折扣）
    if (discountTotal > 0) {
      items.push({
        ItemSeq: items.length + 1,
        ItemName: "折扣",
        ItemCount: 1,
        ItemWord: "式",
        ItemPrice: -discountTotal,
        ItemTaxType: "1", // 假設運費也是應稅的
        ItemAmount: -discountTotal,
      });
    }

    // 添加運費項目（如果有運費）
    if (order.deliver_fee > 0) {
      items.push({
        ItemSeq: items.length + 1,
        ItemName: "運費",
        ItemCount: 1,
        ItemWord: "式",
        ItemPrice: order.deliver_fee,
        ItemTaxType: "1", // 假設運費也是應稅的
        ItemAmount: order.deliver_fee,
      });
    }

    console.log(order, items);
    return { order, items };
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// 新增發票後需存入資料庫
async function saveInvoiceToDatabase(merchant_trade_no, data) {
  // 轉換日期格式
  const invoiceDate = moment(data.InvoiceDate, "YYYY-MM-DD+HH:mm:ss")
    .tz("Asia/Taipei")
    .format("YYYY-MM-DD HH:mm:ss");

  const sql = `
    UPDATE orders
    SET
      invoice_rtn_code = ?,
      invoice_no = ?,
      invoice_date = ?,
      invoice_random_number = ?,
      last_modified_at = NOW()
    WHERE merchant_trade_no = ?
  `;

  try {
    const [result] = await db.query(sql, [
      data.RtnCode,
      data.InvoiceNo,
      invoiceDate,
      data.RandomNumber,
      merchant_trade_no,
    ]);
    console.log("Update result:", result);
    if (result.affectedRows === 0) {
      throw new Error("No rows updated. Order ID might not exist.");
    }
  } catch (error) {
    console.error("Database error:", error, data);
    throw error; // 重新拋出錯誤，讓調用者知道發生了問題
  }
}

// 產生 CheckMacValue
const generateCheckMacValue = (data) => {
  const sortedKeys = Object.keys(data).sort();
  let checkString = `HashKey=${HASHKEY_INVOICE}`;
  sortedKeys.forEach((key) => {
    checkString += `&${key}=${data[key]}`;
  });
  checkString += `&HashIV=${HASHIV_INVOICE}`;
  const encodedString = encodeURIComponent(checkString).toLowerCase();
  return CryptoJS.SHA256(encodedString).toString().toUpperCase();
};
export default router;

// 綠界時間轉換
function formatInvoiceDate(dateString) {
  // 將 "+" 替換為空格
  const formattedDate = dateString.replace("+", " ");
  // 創建一個 UTC 日期對象
  const utcDate = new Date(formattedDate + "Z"); // 添加 'Z' 表示這是 UTC 時間

  // 轉換為台灣時間
  const taiwanDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000); // 加上 8 小時

  // 格式化為 MySQL datetime 格式
  return taiwanDate.toISOString().slice(0, 19).replace("T", " ");
}

// ReturnURL為付款結果通知回傳網址，為特店server或主機的URL，用來接收綠界後端回傳的付款結果通知。
// ClientBackURL 消費者點選此按鈕後，會將頁面導回到此設定的網址
// OrderResultURL 有別於ReturnURL (server端的網址)，OrderResultURL為特店的client端(前端)網址。消費者付款完成後，綠界會將付款結果參數以POST方式回傳到到該網址
// 綠界回傳範例
/*
req.body: {
  TotalSuccessTimes: '',
  PaymentNo: '',
  PaymentTypeChargeFee: '0',
  red_dan: '',
  red_yet: '',
  gwsr: '',
  red_ok_amt: '',
  PeriodType: '',
  SimulatePaid: '1',
  AlipayTradeNo: '',
  MerchantID: '3002607',
  TenpayTradeNo: '',
  WebATMAccNo: '',
  TradeDate: '2024/07/06 13:07:22',
  TWQRTradeNo: 'OPAY20240706130735',
  RtnMsg: '付款成功',
  CustomField4: '',
  PayFrom: '',
  ATMAccBank: '',
  PaymentType: 'TWQR_OPAY',
  TotalSuccessAmount: '',
  MerchantTradeNo: 'test1720242438974',
  StoreID: '',
  stage: '',
  WebATMAccBank: '',
  CustomField1: '',
  PeriodAmount: '',
  TradeNo: '2407061307225373',
  card4no: '',
  card6no: '',
  auth_code: '',
  stast: '',
  PaymentDate: '2024/07/06 13:08:18',
  CheckMacValue: '0C3D8E0873B3B43E97CCF843BAAF5AC031F4A02DED778268E597F3E028E64A70',
  RtnCode: '1',
  eci: '',
  TradeAmt: '1363',
  Frequency: '',
  red_de_amt: '',
  process_date: '',
  amount: '',
  CustomField2: '',
  ATMAccNo: '',
  ExecTimes: '',
  CustomField3: '',
  staed: '',
  WebATMBankName: '',
  AlipayID: ''
}
 */
