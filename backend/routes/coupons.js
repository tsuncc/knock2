import express from "express";
import db from "../utils/connect.js";
import moment from "moment-timezone";

const router = express.Router();
const dateFormat = "YYYY-MM-DD";
const dateTimeFormat = "YYYY-MM-DD HH:mm";

router.get("/", async (req, res) => {
  const { member_id, page = 1, status } = req.query;
  const perPage = 5; // 每頁筆數
  const offset = (page - 1) * perPage;

  try {
    let condition;
    let countCondition;

    switch (status) {
      case "ongoing":
        condition = `cm.used_at IS NULL AND c.valid_until >= now()`;
        countCondition = `cm.used_at IS NULL AND c.valid_until >= now()`;
        break;
      case "used":
        condition = `cm.used_at IS NOT NULL`;
        countCondition = `cm.used_at IS NOT NULL`;
        break;
      case "expired":
        condition = `cm.used_at IS NULL AND c.valid_until < now()`;
        countCondition = `cm.used_at IS NULL AND c.valid_until < now()`;
        break;
      case "all":
        condition = `1`;
        countCondition = `1`;
        break;
      default:
        return res.status(400).json({ error: "Invalid status parameter" });
    }

    let sql;
    let countSql;

    sql = `
      SELECT 
        cm.id,
        cm.coupon_id,
        cm.used_at,
        c.coupon_name,
        c.coupon_type_id,
        c.minimum_order,
        c.discount_amount,
        c.discount_percentage,
        c.discount_max,
        c.valid_from,
        c.valid_until,
        c.max_usage_per_user,
        c.total_limit,
        ct.coupon_type_name,
        cpa.coupon_product_id,
        pm.product_name,
        pm.price
      FROM coupon_member cm
      JOIN coupons c ON c.id = cm.coupon_id
      JOIN coupon_types ct ON ct.id = c.coupon_type_id
      LEFT JOIN coupon_product_associations cpa ON cpa.coupon_id = c.id
      LEFT JOIN product_management pm ON pm.product_id = cpa.coupon_product_id
      WHERE cm.member_id = ? AND ${condition}
      ORDER BY cm.id DESC
    `;

    countSql = `
      SELECT COUNT(*) AS count
      FROM coupon_member cm
      JOIN coupons c ON c.id = cm.coupon_id
      WHERE cm.member_id = ? AND ${countCondition};
    `;

    const [coupons] = await db.query(sql, [member_id, offset, perPage]);

    // 格式化日期
    coupons.forEach((r) => {
      r.valid_from = moment(r.valid_from).isValid()
        ? moment(r.valid_from).format(dateTimeFormat)
        : "";
      r.valid_until = moment(r.valid_until).isValid()
        ? moment(r.valid_until).format(dateTimeFormat)
        : "";
    });

    // 獲取總頁數
    const [countResult] = await db.query(countSql, [member_id]);
    const count = countResult[0].count;
    const totalPages = Math.ceil(count / perPage);

    // 將結果按 coupon_id 分組並包含產品資訊
    const groupedCoupons = coupons.reduce((acc, row) => {
      if (!acc[row.coupon_id]) {
        acc[row.coupon_id] = {
          id: row.id,
          coupon_id: row.coupon_id,
          used_at: row.used_at,
          coupon_name: row.coupon_name,
          coupon_type_id: row.coupon_type_id,
          minimum_order: row.minimum_order,
          discount_amount: row.discount_amount,
          discount_percentage: row.discount_percentage,
          discount_max: row.discount_max,
          valid_from: row.valid_from,
          valid_until: row.valid_until,
          max_usage_per_user: row.max_usage_per_user,
          total_limit: row.total_limit,
          coupon_type_name: row.coupon_type_name,
          products: [],
        };
      }
      if (row.coupon_product_id && row.product_name && row.price) {
        acc[row.coupon_id].products.push({
          product_id: row.coupon_product_id,
          product_name: row.product_name,
          price: row.price,
        });
      }
      return acc;
    }, {});

    // 轉換為數組並返回結果
    const result = Object.values(groupedCoupons);

    res.json({
      status: true,
      rows: result,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching member coupons: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 更新購物車優惠券
router.post("/use", async (req, res) => {
  const { member_id, coupon_id, product_id } = req.body;

  let updateSql;
  let value;

  try {
    const checkedTypeSql = `SELECT id, coupon_type_id FROM coupons WHERE id = ?`;
    const [checkedResult] = await db.query(checkedTypeSql, [coupon_id]);

    if (checkedResult[0].coupon_type_id === 1) {
      updateSql = `
        UPDATE coupon_member
        SET in_cart = 1
        WHERE member_id = ? AND coupon_id = ?;
      `;
      value = [member_id, coupon_id];
    }

    if (checkedResult[0].coupon_type_id === 2) {
      updateSql = `
        UPDATE cart_member
        SET cart_product_coupon_id = ?
        WHERE cart_member_id = ? AND cart_product_id = ?
      `;
      value = [coupon_id, member_id, product_id];
    }

    const [result] = await db.query(updateSql, value);
    console.log(
      req.body,
      "adding coupon to cart:",
      "checkedResult[0]",
      checkedResult[0],
      "result",
      result
    );
    res.json({ status: true, message: "Coupon added to cart successfully" });
  } catch (error) {
    console.error("Error adding coupon: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 從購物車使用優惠券
router.post("/remove", async (req, res) => {
  const { member_id, coupon_id, product_id } = req.body;

  try {
    const checkedTypeSql = `SELECT id, coupon_type_id FROM coupons WHERE id = ?`;
    const [checkedResult] = await db.query(checkedTypeSql, [coupon_id]);

    let updateSql;
    let value;

    if (checkedResult[0].coupon_type_id === 1) {
      updateSql = `
        UPDATE coupon_member
        SET in_cart = 0
        WHERE member_id = ? AND coupon_id = ?;
      `;
      value = [member_id, coupon_id];
    }

    if (checkedResult[0].coupon_type_id === 2) {
      updateSql = `
        UPDATE cart_member
        SET cart_product_coupon_id = NULL
        WHERE cart_member_id = ? AND cart_product_id = ?
      `;
      value = [member_id, product_id];
    }

    const [result] = await db.query(updateSql, value);

    console.log("remove coupon from cart", req.body, checkedResult, result);
    res.json({
      status: true,
      message: "Coupon remove from to cart successfully",
    });
  } catch (error) {
    console.error("Error removing coupon from cart: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 從購物車移除使用的優惠券
router.post("/delete_in_cart", async (req, res) => {
  const { member_id, coupon_id } = req.body;
  try {
    // 更新數據庫中的優惠券狀態為不在購物車中
    const sql = `
      UPDATE coupon_member
      SET in_cart = 0
      WHERE member_id = ? AND coupon_id IN (?);
    `;
    await db.query(sql, [member_id, coupon_id]);
    res.json({ status: true, message: "Coupon update in_cart successfully" });
  } catch (error) {
    console.error("Error updating coupons:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 取得會員購物車可用的且 coupon type id = 1 （不指定商品）的優惠券
router.get("/in_cart", async (req, res) => {
  const { member_id } = req.query;

  try {
    const sql = `
    SELECT 
      cm.id,
      cm.coupon_id,
      cm.used_at,
      cm.in_cart,
      c.coupon_name,
      c.coupon_type_id,
      c.minimum_order,
      c.discount_amount,
      c.discount_percentage,
      c.discount_max,
      c.valid_from,
      c.valid_until,
      c.max_usage_per_user,
      c.total_limit,
      ct.coupon_type_name
    FROM coupon_member cm
    JOIN coupons c ON c.id = cm.coupon_id
    JOIN coupon_types ct ON ct.id = c.coupon_type_id
    WHERE cm.member_id = ? AND c.coupon_type_id = 1 AND cm.used_at IS NULL AND c.valid_until >= NOW();
  `;

    const [rows] = await db.query(sql, [member_id]);

    // 格式化日期
    rows.forEach((r) => {
      r.valid_from = moment(r.valid_from).isValid()
        ? moment(r.valid_from).format(dateTimeFormat)
        : "";
      r.valid_until = moment(r.valid_until).isValid()
        ? moment(r.valid_until).format(dateTimeFormat)
        : "";
    });

    res.json({
      status: true,
      rows: rows,
    });
  } catch (error) {
    console.error("Error fetching member coupons: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 取得會員購物車可用的且 coupon type id = 2 （不指定商品）的優惠券
router.get("/product", async (req, res) => {
  const { member_id } = req.query;

  try {
    const sql = `
    SELECT 
      cm.id,
      cm.coupon_id,
      cm.used_at,
      c.coupon_name,
      c.coupon_type_id,
      c.minimum_order,
      c.discount_amount,
      c.discount_percentage,
      c.discount_max,
      c.valid_from,
      c.valid_until,
      c.max_usage_per_user,
      c.total_limit,
      ct.coupon_type_name,
      cpa.coupon_product_id,
      pm.product_name,
      pm.price,
      cam.cart_product_coupon_id in_cart
    FROM coupon_member cm
    JOIN coupons c ON c.id = cm.coupon_id
    JOIN coupon_types ct ON ct.id = c.coupon_type_id
    LEFT JOIN coupon_product_associations cpa ON cpa.coupon_id = c.id
    LEFT JOIN product_management pm ON pm.product_id = cpa.coupon_product_id
    LEFT JOIN cart_member cam ON cam.cart_product_id = cpa.coupon_product_id AND cam.cart_product_coupon_id = cpa.coupon_id
    WHERE cm.member_id = ? AND c.coupon_type_id = 2 AND cm.used_at IS NULL AND c.valid_until >= NOW();
  `;

    const [rows] = await db.query(sql, [member_id]);

    // 格式化日期
    rows.forEach((r) => {
      r.valid_from = moment(r.valid_from).isValid()
        ? moment(r.valid_from).format(dateTimeFormat)
        : "";
      r.valid_until = moment(r.valid_until).isValid()
        ? moment(r.valid_until).format(dateTimeFormat)
        : "";
    });

    rows.forEach((r) => {
      r.in_cart = r.in_cart > 0 ? 1 : 0;
    });

    // 將結果按 coupon_id 分組並包含產品資訊
    const groupedCoupons = rows.reduce((acc, row) => {
      if (!acc[row.coupon_id]) {
        acc[row.coupon_id] = {
          id: row.id,
          coupon_id: row.coupon_id,
          used_at: row.used_at,
          coupon_name: row.coupon_name,
          coupon_type_id: row.coupon_type_id,
          minimum_order: row.minimum_order,
          discount_amount: row.discount_amount,
          discount_percentage: row.discount_percentage,
          discount_max: row.discount_max,
          valid_from: row.valid_from,
          valid_until: row.valid_until,
          max_usage_per_user: row.max_usage_per_user,
          total_limit: row.total_limit,
          coupon_type_name: row.coupon_type_name,
          products: [],
        };
      }
      if (row.coupon_product_id && row.product_name && row.price) {
        acc[row.coupon_id].products.push({
          product_id: row.coupon_product_id,
          product_name: row.product_name,
          price: row.price,
          in_cart: row.in_cart,
        });
      }
      return acc;
    }, {});

    const result = Object.values(groupedCoupons);

    res.json({
      status: true,
      rows: result,
    });
  } catch (error) {
    console.error("Error fetching member coupons: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 取得會員尚未領取的優惠券
router.get("/get-coupon", async (req, res) => {
  const { member_id } = req.query;

  try {
    const sql = `
      SELECT c.*
      FROM coupons c
      LEFT JOIN coupon_member cm 
      ON c.id = cm.coupon_id 
      AND cm.member_id = ?
      WHERE cm.coupon_id IS NULL
      AND c.valid_from <= CURDATE() 
      AND c.valid_until >= CURDATE()
    `;

    const [rows] = await db.query(sql, [member_id]);

    // 格式化日期
    rows.forEach((r) => {
      r.valid_from = moment(r.valid_from).isValid()
        ? moment(r.valid_from).format(dateTimeFormat)
        : "";
      r.valid_until = moment(r.valid_until).isValid()
        ? moment(r.valid_until).format(dateTimeFormat)
        : "";
    });

    res.json({
      status: true,
      rows,
    });
  } catch (error) {
    console.error("Error fetching member coupons: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 新增會員新領取的優惠券
router.post("/add", async (req, res) => {
  const { member_id, coupon_id } = req.body;

  try {
    const sql = `
      INSERT INTO coupon_member (coupon_id, member_id, create_date) 
      VALUES (?, ?, now())
    `;

    const [result] = await db.query(sql, [coupon_id, member_id]);

    res.json({ status: true, message: "Coupon added to member successfully" });
  } catch (error) {
    console.error("Error adding coupon: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
