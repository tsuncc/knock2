import express from "express";
import db from "./../utils/connect.js";
import moment from "moment-timezone";

const router = express.Router();
const dateFormat = "YYYY-MM-DD";
const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

const getPaymentType = (payment_type) => {
  if (!payment_type) {
    return (payment_type = "待付款");
  } else {
    // 找到第一個 "_" 的位置
    const underscoreIndex = payment_type.indexOf("_");

    // 如果有找到 "_"，則取 "_" 之前的字串，否則取整個字串
    const prefix =
      underscoreIndex !== -1
        ? payment_type.substring(0, underscoreIndex)
        : payment_type;

    switch (prefix) {
      case "Credit":
        payment_type = "線上刷卡";
        break;
      case "CVS":
        payment_type = "超商付款";
        break;
      case "ATM":
        payment_type = "轉帳";
        break;
      case "WebATM":
        payment_type = "網路銀行";
        break;
      case "BARCODE":
        payment_type = "超商條碼繳款";
        break;
      case "TWQR":
        payment_type = "歐付寶行動支付";
        break;
      default:
        payment_type = "其他付款方式";
        break;
    }

    return payment_type;
  }
};

router.get("/list", async (req, res) => {
  const { member_id, status, page, product_name, start_date, end_date } =
    req.query;
  const perPage = 5; // 每頁筆數
  let currentPage = parseInt(page) || 1;
  const offset = (currentPage - 1) * perPage;

  if (currentPage < 1) {
    return res.redirect("?page=1");
  }

  try {
    let condition;

    switch (status) {
      case "ongoing":
        condition = `((o.rtn_code IS NULL OR o.rtn_code = 0 ) AND o.cancel = 0 AND o.order_date + INTERVAL 7 DAY > CURDATE())`;
        break;
      case "shipping":
        condition = `o.rtn_code = 1 AND o.cancel = 0 AND o.deliver = 0`;
        break;
      case "completed":
        condition = `o.rtn_code = 1 AND o.cancel = 0 AND o.deliver = 1`;
        break;
      case "canceled":
        condition = `(o.cancel = 1 OR (o.rtn_code = 0 AND o.order_date + INTERVAL 7 DAY <= CURDATE()))`;
        break;
        break;
      default:
        return res
          .status(400)
          .json({ error: `Invalid status parameter, status: ${status}` });
    }

    if (product_name) {
      condition += ` AND o.id IN (
        SELECT DISTINCT od.order_id 
        FROM order_details od 
        JOIN product_management pm ON pm.product_id = od.order_product_id 
        WHERE pm.product_name LIKE '%${product_name}%'
      )`;
    }

    if (start_date && end_date) {
      condition += ` AND o.order_date BETWEEN '${start_date}' AND '${end_date}'`;
    }

    // 取得訂單資料
    const orderSql = `
      SELECT 
        o.id AS order_id,
        o.order_date,
        o.merchant_trade_no,
        o.payment_type,
        CONCAT(c.city_name, d.district_name, o.order_address) AS full_address,
        os.order_status_name,
        o.invoice_rtn_code,
        o.invoice_no,
        o.invoice_date,
        o.invoice_random_number,
        o.deliver_fee,
        o.payment_date,
        o.order_status_id,
        o.rtn_code,
        o.deliver,
        o.cancel,
        o.order_coupon_id AS coupon_id,
        discount_amount,
        discount_percentage,
        discount_max,
        CAST(SUM(od.order_quantity * od.order_unit_price) AS UNSIGNED) AS subtotal_price,
        CAST(SUM(od.order_quantity * od.order_unit_price + o.deliver_fee) AS UNSIGNED) AS total_price
      FROM orders o
      LEFT JOIN order_details od ON od.order_id = o.id
      LEFT JOIN product_management pm ON pm.product_id = od.order_product_id
      LEFT JOIN district d ON d.id = o.order_district_id
      LEFT JOIN city c ON c.id = d.city_id
      LEFT JOIN order_status os ON os.id = o.order_status_id
      LEFT JOIN coupons ON coupons.id = o.order_coupon_id
      WHERE o.member_id = ? AND ${condition}
      GROUP BY o.id
      ORDER BY o.order_date DESC, o.id desc
      LIMIT ? OFFSET ?;
    `;

    // SUM(od.order_quantity * pm.price) AS subtotal_price,
    // SUM(od.order_quantity * pm.price + o.deliver_fee) AS total_price

    const [orders] = await db.query(orderSql, [member_id, perPage, offset]);

    // 格式化 order_date
    orders.forEach((v) => {
      const m = moment(v.order_date);
      if (m.isValid()) {
        v.order_date = m.format(dateFormat);
      } else {
        v.order_date = "無訂單日期";
      }
    });

    // 格式化 payment_type
    orders.forEach((v) => {
      v.payment_type = getPaymentType(v.payment_type);
    });

    // 取得訂單商品圖片
    const orderDetailsSql = `
    SELECT 
      od.order_id,
      od.order_product_id AS product_id,
      pm.product_name,
      od.order_quantity,
      od.product_coupon_id AS coupon_id,
      c.discount_amount,
      c.discount_percentage,
      c.discount_max,
      od.order_unit_price,
      o.rtn_code,
      o.payment_date,
      o.deliver,
      o.cancel,
      img.product_img
    FROM order_details od
    LEFT JOIN product_management pm ON pm.product_id = od.order_product_id
    LEFT JOIN (
      SELECT img_product_id, product_img,
        ROW_NUMBER() OVER (PARTITION BY img_product_id ORDER BY img_id) AS rn
      FROM product_img
    ) img ON img.img_product_id = od.order_product_id AND img.rn = 1
    LEFT JOIN orders o ON o.id = od.order_id
    LEFT JOIN coupons c ON c.id = od.product_coupon_id
    WHERE od.order_id IN (SELECT id FROM orders WHERE member_id = ? AND ${condition});
  `;

    const [orderDetails] = await db.query(orderDetailsSql, [member_id]);

    // 訂單總頁數
    const countSql = `
      SELECT COUNT(*) AS count
      FROM orders o
      WHERE member_id = ? AND ${condition};
    `;

    const [[{ count }]] = await db.query(countSql, [member_id]);
    const totalPages = Math.ceil(count / perPage);

    // 計算每筆訂單的 discountTotal
    orders.forEach((order) => {
      let productDiscount = 0;
      let discountedProductOriginalTotal = 0;

      orderDetails
        .filter((item) => item.order_id === order.order_id)
        .forEach((item) => {
          const total = item.order_quantity * item.order_unit_price;
          if (item.discount_percentage) {
            const percentage = (1 - item.discount_percentage / 100).toFixed(2);
            const discount = Math.floor(total * percentage);
            productDiscount +=
              discount >= item.discount_max ? item.discount_max : discount;
            discountedProductOriginalTotal += total;
          } else if (item.discount_amount) {
            productDiscount += item.discount_amount;
            discountedProductOriginalTotal += total;
          }
        });

      let orderDiscount = 0;
      const excludeProductTotal =
        order.subtotal_price - discountedProductOriginalTotal;
      if (order.discount_percentage) {
        const percentage = (1 - order.discount_percentage / 100).toFixed(2);
        const discount = Math.floor(excludeProductTotal * percentage);
        orderDiscount +=
          discount > order.discount_max ? order.discount_max : discount;
      }
      if (order.discount_amount) {
        orderDiscount = order.discount_amount;
      }

      const discountTotal = productDiscount + orderDiscount;
      order.discountTotal = discountTotal;
    });

    console.log("orders data: ", orders);
    console.log("order details data: ", orderDetails);

    // 將查詢結果傳送到前端
    res.json({
      status: true,
      orders,
      orderDetails,
      perPage,
      currentPage,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching orders: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET order_details data
router.get("/:orderId", async (req, res) => {
  // 從 query 中取得 orderId
  const orderId = req.params.orderId;

  try {
    // 取得訂單資料
    const orderSql = `
      SELECT 
        o.id AS order_id,
        o.order_date,
        o.merchant_trade_no,
        o.rtn_code,
        o.payment_type,
        o.payment_date,
        CONCAT(c.city_name, d.district_name, o.order_address) AS full_address,
        o.order_status_id,
        os.order_status_name,
        o.deliver_fee,
        o.invoice_rtn_code,
        o.invoice_no,
        o.invoice_date,
        o.invoice_random_number,
        o.order_coupon_id coupon_id,
        discount_amount,
        discount_percentage,
        discount_max,
        o.deliver,
        o.cancel,
        CAST(SUM(od.order_quantity * od.order_unit_price) AS UNSIGNED) AS subtotal_price,
        CAST(SUM(od.order_quantity * od.order_unit_price + o.deliver_fee) AS UNSIGNED) AS total_price
      FROM orders o
      LEFT JOIN order_details od ON od.order_id = o.id
      LEFT JOIN product_management pm ON pm.product_id = od.order_product_id
      LEFT JOIN district d ON d.id = o.order_district_id
      LEFT JOIN city c ON c.id = d.city_id
      LEFT JOIN order_status os ON os.id = o.order_status_id
      LEFT JOIN coupons ON coupons.id = o.order_coupon_id
      WHERE o.id = ?
      GROUP BY o.id;
    `;

    const [orders] = await db.query(orderSql, [orderId]);

    const order = orders[0];

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 格式化日期
    const formatOrderDate = (date, format) => {
      const m = moment(date);
      return m.isValid() ? m.format(format) : "";
    };

    order.order_date = formatOrderDate(order.order_date, dateFormat);
    order.invoice_date = formatOrderDate(order.invoice_date, dateTimeFormat);
    order.payment_date = formatOrderDate(order.payment_date, dateTimeFormat);
    order.payment_type = getPaymentType(order.payment_type)

    // 取得訂單詳細資料
    const orderDetailsSql = `
      SELECT 
        od.id,
        od.order_id,
        od.order_product_id AS product_id,
        pm.product_name,
        od.order_unit_price,
        od.order_quantity,
        img.product_img,
        od.product_coupon_id,
        discount_amount,
        discount_percentage,
        discount_max,
        od.review_status
      FROM order_details od
      LEFT JOIN product_management pm ON pm.product_id = od.order_product_id
      LEFT JOIN coupons ON coupons.id = od.product_coupon_id
      LEFT JOIN (
        SELECT img_product_id, product_img,
          ROW_NUMBER() OVER (PARTITION BY img_product_id ORDER BY img_id) AS rn
        FROM product_img
      ) img ON img.img_product_id = od.order_product_id AND img.rn = 1
      WHERE od.order_id = ?
    `;

    const [orderDetails] = await db.query(orderDetailsSql, [orderId]);

    let productDiscount = 0;
    let discountedProductOriginalTotal = 0;

    orderDetails.forEach((item) => {
      const total = item.order_quantity * item.order_unit_price;
      if (item.discount_percentage) {
        const percentage = (1 - item.discount_percentage / 100).toFixed(2);
        const discount = Math.floor(total * percentage);
        productDiscount +=
          discount >= item.discount_max ? item.discount_max : discount;
        discountedProductOriginalTotal += total;
      } else if (item.discount_amount) {
        productDiscount += item.discount_amount;
        discountedProductOriginalTotal += total;
      }
    });

    let orderDiscount = 0;
    const excludeProductTotal =
      order.subtotal_price - discountedProductOriginalTotal;
    if (order.discount_percentage) {
      const percentage = (1 - order.discount_percentage / 100).toFixed(2);
      const discount = Math.floor(excludeProductTotal * percentage);
      orderDiscount +=
        discount > order.discount_max ? order.discount_max : discount;
    }
    if (order.discount_amount) {
      orderDiscount = order.discount_amount;
    }

    const discountTotal = productDiscount + orderDiscount;
    orders[0].discountTotal = discountTotal;

    console.log("orders data: ", orders);
    console.log("order details data: ", orderDetails);

    // 將查詢結果傳送到前端
    res.json({
      status: true,
      orders,
      orderDetails,
    });
  } catch (error) {
    console.error("Error fetching orders: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET order_reviews data
router.get("/api/reviews/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // 取得評價資料
    const sql = `
    SELECT
      o.id order_id,
      u.name,
      u.nick_name,
      od.order_product_id,
      pm.product_name,
      (
          SELECT pi.product_img
          FROM product_img pi
          WHERE pi.img_product_id = od.order_product_id
          LIMIT 1
      ) product_img,
      od.review,
      od.rate,
      od.review_status,
      od.review_date
    FROM order_details od
    LEFT JOIN orders o ON o.id = od.order_id
    LEFT JOIN users u ON u.user_id = o.member_id
    LEFT JOIN product_management pm ON pm.product_id = od.order_product_id
    WHERE o.id = ?
    `;

    const [rows] = await db.query(sql, [orderId]);

    rows.forEach((r) => {
      const m = moment(r.review_date);
      if (m.isValid()) {
        r.review_date = m.format(dateTimeFormat);
      } else {
        r.review_date = "";
      }
    });

    console.log("orders reviews: ", rows);

    const success = !!rows.length;

    // 將查詢結果傳送到前端
    res.json({
      success,
      rows,
    });
  } catch (error) {
    console.error("Error fetching order reviews: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST order_reviews data
router.post("/api/add-reviews", async (req, res) => {
  const reviews = req.body;

  if (!Array.isArray(reviews)) {
    return res.status(400).json({
      success: false,
      message: "Invalid data format.",
    });
  }

  try {
    const sql = `
      UPDATE order_details SET 
        review = ?, 
        rate = ?, 
        review_status = 1,
        review_date = now()
      WHERE order_id = ? AND order_product_id = ?;
    `;

    const reviewPromises = reviews.map(
      ({ review, rate, order_id, order_product_id }) => {
        return db.query(sql, [review, rate, order_id, order_product_id]);
      }
    );

    const results = await Promise.all(reviewPromises);

    const allSuccess = results.every(([result]) => result.affectedRows === 1);

    res.json({
      success: allSuccess,
    });
  } catch (error) {
    console.error("Error while processing add reviews", error);
    res.status(500).json({
      error: "An error occurred while processing add reviews.",
    });
  }
});

// POST update orders
router.post("/api/cancel_order", async (req, res) => {
  const { order_id } = req.query;

  try {
    const sql = `
      UPDATE orders SET 
        cancel = 1, 
        last_modified_at = now()
      WHERE id = ?;
    `;

    await db.query(sql, [order_id]);

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Error while canceling order", error);
    res.status(500).json({
      error: "An error occurred while canceling order.",
    });
  }
});

export default router;

// GET orders data
// router.get("/", async (req, res) => {
//   // 從 query 中取得 member_id, order_status_id
//   const { member_id, order_status_id, page } = req.query;
//   const perPage = 5; //每頁筆數
//   let currentPage = parseInt(page) || 1;
//   const offset = (currentPage - 1) * perPage;

//   if (currentPage < 1) {
//     return res.redirect("?page=1");
//   }

//   try {
//     // 取得訂單資料
//     const orderSql = `
//       SELECT
//         o.id AS order_id,
//         o.order_date,
//         o.merchant_trade_no,
//         o.payment_type,
//         CONCAT(c.city_name, d.district_name, o.order_address) AS full_address,
//         o.order_status_id,
//         os.order_status_name,
//         o.invoice_rtn_code,
//         o.invoice_no,
//         o.invoice_date,
//         o.invoice_random_number,
//         o.deliver_fee,
//         SUM(od.order_quantity * pm.price) AS subtotal_price,
//         SUM(od.order_quantity * pm.price + o.deliver_fee) AS total_price
//       FROM orders o
//       LEFT JOIN order_details od ON od.order_id = o.id
//       LEFT JOIN product_management pm ON pm.product_id = od.order_product_id
//       LEFT JOIN district d ON d.id = o.order_district_id
//       LEFT JOIN city c ON c.id = d.city_id
//       LEFT JOIN order_status os ON os.id = o.order_status_id
//       WHERE o.member_id = ? AND o.order_status_id = ?
//       GROUP BY o.id
//       ORDER BY o.id DESC
//       LIMIT ? OFFSET ?;
//     `;

//     const [orders] = await db.query(orderSql, [
//       member_id,
//       order_status_id,
//       perPage,
//       offset,
//     ]);

//     // 格式化 order_date
//     orders.forEach((v) => {
//       const m = moment(v.order_date);
//       if (m.isValid()) {
//         v.order_date = m.format(dateFormat);
//       } else {
//         v.order_date = "無訂單日期";
//       }
//     });

//     // 格式化 payment_type
//     orders.forEach((v) => {
//       v.payment_type = getPaymentType(v.payment_type);
//     });

//     // 取得訂單商品圖片
//     const orderDetailsSql = `
//       SELECT
//         od.order_id,
//         od.order_product_id AS product_id,
//         img.product_img
//       FROM order_details od
//       LEFT JOIN (
//         SELECT img_product_id, product_img,
//           ROW_NUMBER() OVER (PARTITION BY img_product_id ORDER BY img_id) AS rn
//         FROM product_img
//       ) img ON img.img_product_id = od.order_product_id AND img.rn = 1
//       WHERE od.order_id IN (SELECT id FROM orders WHERE member_id = ? AND order_status_id = ?);
//     `;

//     const [orderDetails] = await db.query(orderDetailsSql, [
//       member_id,
//       order_status_id,
//     ]);

//     // 訂單總頁數
//     const countSql = `
//       SELECT COUNT(*) AS count
//       FROM orders
//       WHERE member_id = ? AND order_status_id = ?;
//     `;

//     const [[{ count }]] = await db.query(countSql, [
//       member_id,
//       order_status_id,
//     ]);
//     const totalPages = Math.ceil(count / perPage);

//     console.log("orders data: ", orders);
//     console.log("order details data: ", orderDetails);

//     // 將查詢結果傳送到前端
//     res.json({
//       status: true,
//       orders,
//       orderDetails,
//       perPage,
//       offset,
//       totalPages,
//     });
//   } catch (error) {
//     console.error("Error fetching orders: ", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
