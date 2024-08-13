import express from "express";
import db from "../utils/connect.js";
// import moment from "moment-timezone";
import bodyParser from "body-parser";
import { sendNotificationToUser, sendNotificationToAll } from './notifications.js'

const router = express.Router();

router.use(bodyParser.json());
// const dateFormat = "YYYY-MM-DD HH:mm:ss";

// CART_POST insert items into to cart_member table
router.post("/api/cart_member", async (req, res) => {
  const data = { ...req.body };
  console.log("member cart data", data);
  try {
    // 確認會員購物車是否已經有該產品
    const [existingCartItem] = await db.query(
      "SELECT * FROM cart_member WHERE cart_member_id = ? AND cart_product_id = ?",
      [data.memberId, data.productId]
    );

    const insertSql = `
      INSERT INTO cart_member (
        cart_member_id, 
        cart_product_id, 
        cart_product_quantity, 
        created_at, 
        last_modified_at
      ) VALUES (
        ?, ?, ?, now(), now()
      );
    `;

    const updateSql = `
      UPDATE cart_member
      SET cart_product_quantity = cart_product_quantity + ?, 
      last_modified_at = now()
      WHERE cart_member_id = ? AND cart_product_id = ?
    `;

    let memberCartResults;

    // 如果會員購物車已存在此商品，更新商品數量
    if (existingCartItem.length > 0) {
      const updateValues = [data.cartQty, data.memberId, data.productId];
      [memberCartResults] = await db.query(updateSql, updateValues);
    } else {
      // 如果會員購物車「不」已存在此商品，更新商品數量
      const insertValues = [data.memberId, data.productId, data.cartQty];
      [memberCartResults] = await db.query(insertSql, insertValues);
    }

    // 確認是否有成功 insert value
    const success = memberCartResults.affectedRows > 0;

    // 返回結果到前端
    res.json({
      success,
    });
  } catch (error) {
    console.error("Error while processing add to member cart:", error);
    res.status(500).json({
      error: "An error occurred while processing add to member cart.",
    });
  }
});

// POST change device id to member id
router.post("/api/update_cart", async (req, res) => {
  const { memberId, deviceId } = req.body;

  try {
    // 查詢 deviceId 下的商品
    const deviceCartItemsSql = `
      SELECT cart_product_id, cart_product_quantity 
      FROM cart_member 
      WHERE cart_member_id = ?
    `;
    const [deviceCartItems] = await db.query(deviceCartItemsSql, [deviceId]);

    // 查詢 deviceId 下的商品是否與 memberId 下的商品相同
    for (const deviceItem of deviceCartItems) {
      const memberCartItemSql = `
        SELECT cart_product_id, cart_product_quantity 
        FROM cart_member 
        WHERE cart_member_id = ? AND cart_product_id = ?
      `;
      const [memberCartItems] = await db.query(memberCartItemSql, [
        memberId,
        deviceItem.cart_product_id,
      ]);

      if (memberCartItems.length > 0) {
        // 如果有相同的商品，則將 memberId 下的商品數量加上 deviceId 的商品數量
        const newQuantity =
          memberCartItems[0].cart_product_quantity +
          deviceItem.cart_product_quantity;
        const updateCartItemSql = `
          UPDATE cart_member 
          SET cart_product_quantity = ?, last_modified_at = NOW() 
          WHERE cart_member_id = ? AND cart_product_id = ?
        `;
        await db.query(updateCartItemSql, [
          newQuantity,
          memberId,
          deviceItem.cart_product_id,
        ]);

        // 如果有相同的商品，則刪除 deviceId 下的商品
        const deleteDeviceCartItemSql = `
          DELETE FROM cart_member 
          WHERE cart_member_id = ? AND cart_product_id = ?
        `;
        await db.query(deleteDeviceCartItemSql, [
          deviceId,
          deviceItem.cart_product_id,
        ]);
      } else {
        // 如果「沒」有相同的商品，則更新 cart_member_id
        const updateDeviceCartItemSql = `
          UPDATE cart_member 
          SET cart_member_id = ?, last_modified_at = NOW() 
          WHERE cart_member_id = ? AND cart_product_id = ?
        `;
        await db.query(updateDeviceCartItemSql, [
          memberId,
          deviceId,
          deviceItem.cart_product_id,
        ]);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error while updating member id in member cart:", error);
    res
      .status(500)
      .json({ error: "Failed to update member id in member cart" });
  }
});

// CHECKOUT_GET_CART member cart items
router.get("/api/cart", async (req, res) => {
  // 從 query 中取得 member_id
  const { member_id } = req.query;

  try {
    // 取得產品資料
    const sql = `
      SELECT
        cm.id as cart_id,
        pm.product_id,
        pm.product_name,
        pm.price,
        pi.product_img,
        cm.cart_product_quantity,
        cm.cart_product_coupon_id,
        c.coupon_type_id,
        c.minimum_order,
        c.discount_amount,
        c.discount_percentage,
        c.discount_max
      FROM cart_member AS cm
      JOIN product_management AS pm
      ON pm.product_id = cm.cart_product_id
      JOIN (
        SELECT img_product_id, product_img
        FROM product_img
        WHERE (img_product_id, img_id) IN (
            SELECT img_product_id, MIN(img_id)
            FROM product_img
            GROUP BY img_product_id
        )
      ) AS pi ON pi.img_product_id = cm.cart_product_id
      LEFT JOIN coupons AS c
      ON c.id = cm.cart_product_coupon_id
      WHERE cm.cart_member_id = ?
    `;

    const [rows] = await db.query(sql, [member_id]);

    console.log("member address: ", rows);

    // 將查詢結果傳送到前端
    res.json({
      status: true,
      rows,
    });
  } catch (error) {
    console.error("Error fetching member cart: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CHECKOUT_UPDATE_CART update & delete member cart items
router.put("/api/cart/update/:cart_id", async (req, res) => {
  const cartId = +req.params.cart_id || 0;
  const { cart_product_quantity } = req.body;

  if (!cartId) {
    return res.status(400).json({ success: false, message: "Invalid cart ID" });
  }

  if (cart_product_quantity === 0) {
    try {
      const deleteSql = `
        DELETE FROM cart_member
        WHERE id = ?
      `;

      const [deleteResult] = await db.query(deleteSql, [cartId]);
      const success = deleteResult.affectedRows > 0;

      return res.json({
        success,
        message: success
          ? "Cart item deleted successfully"
          : "Failed to delete cart item",
      });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to delete cart item" });
    }
  } else {
    try {
      const updateSql = `
        UPDATE cart_member SET
          cart_product_quantity = ?,
          last_modified_at = NOW()
        WHERE id = ?
      `;

      const [updateResult] = await db.query(updateSql, [
        cart_product_quantity,
        cartId,
      ]);
      const success = updateResult.affectedRows > 0;

      return res.json({
        success,
        message: success
          ? "Cart item updated successfully"
          : "Failed to update cart item",
      });
    } catch (error) {
      console.error("Error updating cart item:", error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to update cart item" });
    }
  }
});

// CHECKOUT_POST insert data into orders and order details tables, delete member's cart_member data
router.post("/api/checkout", async (req, res) => {
  const {
    memberId,
    recipientName,
    recipientMobile,
    recipientDistrictId,
    recipientAddress,
    memberInvoice,
    mobileInvoice,
    recipientTaxId,
    deliverFee,
    orderCouponId,
    orderItems,
  } = req.body;

  try {
    // order_table
    const orderSql = `
      INSERT INTO orders (
        order_date,
        member_id,
        recipient_name,
        recipient_mobile,
        order_district_id,
        order_address,
        member_carrier,
        recipient_invoice_carrier,
        recipient_tax_id,
        deliver_fee,
        order_coupon_id,
        order_status_id,
        created_at,
        last_modified_at
      ) VALUES (now(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now());
    `;

    const orderValues = [
      memberId,
      recipientName,
      recipientMobile,
      recipientDistrictId,
      recipientAddress,
      memberInvoice,
      mobileInvoice,
      recipientTaxId,
      deliverFee,
      orderCouponId,
      1, // order_status_id
    ];

    const [orderResult] = await db.query(orderSql, orderValues);

    const orderId = orderResult.insertId; // 本此新增的 order_id

    // order_details table
    const orderDetailSql = `
      INSERT INTO order_details (
        order_id,
        order_product_id,
        order_quantity,
        order_unit_price,
        product_coupon_id,
        created_at,
        last_modified_at
      ) VALUES (?, ?, ?, ?, ?, now(), now());
    `;

    const orderDetailPromises = orderItems.map(
      ({ productId, productOriginalPrice, orderQty, cartProductCouponId }) => {
        const orderDetailValues = [
          orderId,
          productId,
          orderQty,
          productOriginalPrice,
          cartProductCouponId,
        ];
        return db
          .query(orderDetailSql, orderDetailValues)
          .then(([result]) => result);
      }
    );

    const orderDetailResults = await Promise.all(orderDetailPromises);

    // order_coupon
    const updateCouponSql = `
      UPDATE coupon_member SET
        in_cart = 0,
        used_at = now()
        WHERE member_id = ? AND coupon_id = ?
      `;

    // 提取 cartProductCouponId
    const cartProductCouponIds = orderItems
      .map((item) => item.cartProductCouponId)
      .filter((id) => id !== null);

    // 合併 orderCouponId 和 cartProductCouponId
    const allCouponIds = [orderCouponId, ...cartProductCouponIds];

    const updateCouponPromises = allCouponIds.map((couponId) => {
      return db
        .query(updateCouponSql, [memberId, couponId])
        .then(([result]) => result);
    });

    const updateCouponResults = await Promise.all(updateCouponPromises);

    const success =
      orderResult.affectedRows === 1 &&
      orderDetailResults.length > 0 &&
      orderDetailResults.every((result) => result.affectedRows === 1);

    if (success) {
      const deleteCartSql = `DELETE FROM cart_member WHERE cart_member_id = ?`;
      await db.query(deleteCartSql, [memberId]);
      // 取得綠界訂單需要的資料
      // const productNames = orderDetailResults.map(({ product_name }) => product_name);
      sendNotificationToUser( memberId , '訂單已成立！' );
    }

    // 返回结果到前端
    res.json({
      success,
      orderId,
      // productNames,
    });
    console.log(orderResult, orderDetailResults, updateCouponResults);
  } catch (error) {
    console.error("Error while processing checkout:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing checkout." });
  }
});

// CHECKOUT_GET_PROFILE select user profile from users table
router.get("/api/member_profile", async (req, res) => {
  // 從 query 中取得 member_id, order_status_id
  const { member_id } = req.query;

  try {
    const sql = `
      SELECT
        name,
        mobile_phone,
        invoice_carrier_id,
        tax_id
      FROM users
      WHERE user_id =  ?;
    `;

    const [rows] = await db.query(sql, [member_id]);

    console.log("member profile: ", rows);

    res.json({
      status: true,
      rows,
    });
  } catch (error) {
    console.error("Error fetching member profile: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CHECKOUT_GET_ADDRESS member address
router.get("/api/member_address", async (req, res) => {
  // 從 query 中取得 member_id, order_status_id
  const { member_id } = req.query;

  try {
    // 取得訂單資料
    const sql = `
      SELECT
        a.id,
        a.user_id,
        c.id AS city_id,
        c.city_name,
        d.id AS district_id,
        d.district_name,
        a.address,
        a.recipient_name,
        a.mobile_phone,
        a.type
      FROM address AS a
      JOIN district AS d
      ON a.district_id = d.id
      JOIN city AS c
      ON d.city_id = c.id 
      WHERE a.user_id =  ?;
    `;

    const [rows] = await db.query(sql, [member_id]);

    console.log("member address: ", rows);

    // 將查詢結果傳送到前端
    res.json({
      status: true,
      rows,
    });
  } catch (error) {
    console.error("Error fetching member addresses: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CHECKOUT_ADD_ADDRESS POST insert data into address table
router.post("/api/add_address", async (req, res) => {
  const data = { ...req.body };

  console.log(data);

  // INSERT CHECKOUT DATA INTO address table
  try {
    const sql = `
    INSERT INTO address( 
      user_id, 
      recipient_name,
      mobile_phone,
      district_id, 
      address, 
      type) VALUES (?, ?, ?, ?, ?, 0);
    `;

    const addressValues = [
      data.memberId,
      data.recipientName,
      data.recipientMobile,
      data.recipientDistrictId,
      data.recipientAddress,
    ];
    const [addressResults] = await db.query(sql, addressValues);

    console.log("Address Insert Result:", addressResults); // 後端列印結果

    // 確認是否有成功 insert value
    const success = addressResults.affectedRows === 1;
    const addressId = addressResults.insertId;

    // 返回結果到前端
    res.json({
      success,
      addressId,
    });
  } catch (error) {
    console.error("Error while processing add address from checkout:", error);
    res.status(500).json({
      error: "An error occurred while processing add address from checkout.",
    });
  }
});


// CHECKOUT_EDIT_ADDRESS POST insert data into address table
router.post("/api/edit_address", async (req, res) => {
  const data = { ...req.body };
  console.log('data from edit address form',data);

  try {   
    const sql = `
      UPDATE address SET
        recipient_name = ?,
        mobile_phone = ?,
        district_id = ?, 
        address = ?
      WHERE id = ? AND user_id = ?;
    `;

    const values = [
      data.recipientName,
      data.recipientMobile,
      data.recipientDistrictId,
      data.recipientAddress,
      data.id,
      data.memberId,
    ];
    const [results] = await db.query(sql, values);

    console.log("Address update Result:", results); // 後端列印結果

    // 確認是否有成功 insert value
    const success = results.affectedRows === 1;

    // 返回結果到前端
    res.json({
      success,
    });
  } catch (error) {
    console.error("Error while processing add address from checkout:", error);
    res.status(500).json({
      error: "An error occurred while processing add address from checkout.",
    });
  }
});

// CHECKOUT_DELETE_ADDRESS data from address table
router.delete("/api/delete_address/:addressId", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    result: {},
  };

  const aid = +req.params.addressId || 0;

  if (!aid) {
    output.code = 400;
    output.message = "Invalid address id";
    return res.status(400).json(output);
  }

  try {
    const sql = `DELETE FROM address WHERE id=?`;
    const [deleteAddressResult] = await db.query(sql, [aid]);

    if (deleteAddressResult.affectedRows === 1) {
      output.success = true;
      output.code = 200; // 成功的請求
      output.message = "Address deleted successfully";
      output.result = deleteAddressResult;
    } else {
      output.code = 404; // 找不到資源
      output.message = "Address id not found";
    }

    console.log("delete address id:" + aid);
    res.status(output.code).json(output);
  } catch (error) {
    console.error("Error deleting address:", error);
    output.code = 500; // 內部伺服器錯誤
    output.message = "An error occurred while deleting the address";
    res.status(500).json(output);
  }
});

// CHECKOUT_CITY_GET city data from cities
router.get("/api/city", async (req, res) => {
  try {
    const sql = `SELECT * FROM city`;
    const [rows] = await db.query(sql);

    res.json({
      success: true,
      rows,
    });
  } catch (error) {
    console.error("Error fetching city: ", error);
    res.status(500).json({
      success: false,
      message: "Error fetching city data",
    });
  }
});

// CHECKOUT_DISTRICT_GET district data from cities
router.get("/api/district", async (req, res) => {
  try {
    const sql = `SELECT * FROM district`;
    const [rows] = await db.query(sql);
    const success = rows.affectedRows > 0;

    res.json({
      success: true,
      rows,
    });
  } catch (error) {
    console.error("Error fetching district: ", error);
    res.status(500).json({
      success: false,
      message: "Error fetching city data",
    });
  }
});

export default router;
