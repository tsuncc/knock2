import express from "express";
import moment from "moment-timezone";
import db from "./../utils/connect.js";
import upload from "../utils/upload-imgs.js";

const dateFormat = "YYYY-MM-DD";
const router = express.Router();

const getListDate = async (req) => {
  let success = false;
  let redirect = "";

  const perPage = 9; //每頁數量
  let page = parseInt(req.query.page) || 1;

  if (page < 1) {
    redirect = "?page=1";
    return { success, redirect };
  }
  // 處裡搜尋欄位
  let userSearch = req.query.userSearch || "";
  let price_start = req.query.price_start || 0;
  let price_end = req.query.price_end || 0;
  let idSearch = req.params.product_id || "";
  let category_id = req.query.category_id || "";
  // 排序用
  let sort = req.query.sort || "product_id";
  const order = req.query.order || "DESC";

  let where = " WHERE 1 ";

  if (idSearch) {
    const idSearch_ = db.escape(`${idSearch}`);
    where += `AND ( \`product_id\` LIKE ${idSearch_} ) `;
  }

  if (userSearch) {
    const userSearch_ = db.escape(`%${userSearch}%`);
    where += `AND ( \`product_name\` LIKE ${userSearch_} OR \`product_id\` LIKE ${userSearch_}) `;
  }

  if (Number(price_start) || Number(price_end)) {
    Number(price_start) ? price_start : (price_start = 0);
    Number(price_end) ? price_end : (price_end = 2000);

    // const price_start_ = db.escape(`${price_start}`);
    // const price_end_ = db.escape(`${price_end}`);
    where += `AND ( \`price\` BETWEEN ${price_start} AND ${price_end}) `;
  }

  // 類別篩選
  if (category_id) {
    const category_id_ = db.escape(`${category_id}`);
    where += `AND product_management.category_id=${category_id_} `;
  }
  // order by排序
  if (sort === "created_at") {
    sort = "product_management.created_at";
  }

  const t_sql = `SELECT COUNT(1) totalRows FROM product_management ${where}`;

  const [[{ totalRows }]] = await db.query(t_sql);
  let totalPages = 0;
  let rows = [];
  let productImg = "";
  // 查詢的db有無回傳值
  if (totalRows) {
    // 有回傳，計算總頁數
    totalPages = Math.ceil(totalRows / perPage);
    // 判斷輸入的page是否大於總頁數
    if (page > totalPages) {
      redirect = `?page=${totalPages}`;
      return { success, redirect };
    }

    let orderBy = `ORDER BY ${sort} ${order}`;

    // JOIN分類
    const sql = `SELECT * FROM \`product_management\` JOIN \`product_category\` ON product_management.category_id = product_category.category_id ${where} ${orderBy}  LIMIT ${
      (page - 1) * perPage
    },${perPage}`;

    [rows] = await db.query(sql);

    success = true;

    return {
      success,
      page,
      totalRows,
      totalPages,
      rows,
    };
  }

  return { success, message: "無法查詢到資料，查詢字串可能有誤" };
};

const getFavoriteDate = async (req) => {
  let success = false;
  let redirect = "";
  const perPage = 6; //每頁卡片數量
  let favorite_id = req.params.favorite_id || 0; //取得收藏id

  let where = " WHERE 1 ";

  let page = parseInt(req.query.page) || 1;
  let user_id = parseInt(req.query.user_id) || 1;

  if (page < 1) {
    redirect = "?page=1";
    return { success, redirect };
  }

  if (favorite_id) {
  }

  // user_id 暫設1
  const t_sql = `SELECT COUNT(1) totalRows FROM product_favorites WHERE \`user_id\`=${user_id}`;

  const [[{ totalRows }]] = await db.query(t_sql);

  let totalPages = 0;
  let rows = [];

  if (totalRows) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      redirect = `?page=${totalPages}`;
      return { success, redirect };
    }

    // user_id 暫設1
    const sql = `SELECT * FROM \`product_favorites\` JOIN product_management ON \`fav_product_id\` = \`product_id\` WHERE \`user_id\`=${user_id} ORDER BY \`favorite_id\`  DESC LIMIT ${
      (page - 1) * perPage
    },${perPage}`;

    [rows] = await db.query(sql);

    success = true;
    return {
      success,
      page,
      totalRows,
      totalPages,
      rows,
    };
  } else {
    return { success, redirect };
  }
};

const getImg = async (req) => {
  let success = false;
  let rows = [];
  const product_id = +req.params.product_id || 0;

  const sql = `SELECT product_img.product_img FROM \`product_management\` JOIN \`product_img\` ON \`product_id\` = \`img_product_id\` WHERE \`product_id\` = ${product_id}`;

  [rows] = await db.query(sql);

  success = true;

  return {
    success,
    rows,
  };
};

router.get("/", async (req, res) => {
  const data = await getListDate(req);
  if (data.success) {
    return res.json(data);
  }
  if (data.redirect) {
    return res.redirect(data.redirect);
  }
  if (data.message) {
    return res.json({
      success: data.success,
      message: data.message,
    });
  }
});

router.get("/details/:product_id", async (req, res) => {
  const data = await getListDate(req);
  res.json(data);
});

// 圖片
router.get("/img/:product_id", async (req, res) => {
  try {
    const data = await getImg(req);
    // console.log(req.params.product_id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "/img/:product_id出錯了" });
  }
});

router.get("/favorite", async (req, res) => {
  const data = await getFavoriteDate(req);
  res.json(data);
});

router.get("/favorite/api", async (req, res) => {
  let success = false;
  let rows = [];
  const user_id = parseInt(req.query.user_id) || 1;

  // user_id 暫設1
  const sql = `SELECT * FROM \`product_favorites\` JOIN product_management ON \`fav_product_id\` = \`product_id\` WHERE \`user_id\`=${user_id} ORDER BY \`favorite_id\`  DESC`;

  [rows] = await db.query(sql);
  success = true;
  res.json({
    success,
    rows,
  });
});

// 編輯收藏欄位
router.put("/favorite/edit/:favorite_id/:section", async (req, res) => {
  const section = req.params.section;
  const favorite_id = req.params.favorite_id;

  // UPDATE `product_favorites` SET `section`=1 WHERE `favorite_id`=7;
  const sql =
    "UPDATE `product_favorites` SET `section`=? WHERE `favorite_id`=?";
  const [result] = await db.query(sql, [section, favorite_id]);

  res.json({ result, success: !!result.affectedRows });
});

// 新增
router.post("/favorite/add/:product_id", async (req, res) => {
  // let body = {
  //   user_id: 1, //暫時寫死
  //   fav_product_id: req.params.product_id,
  // };

  const user_id = req.query.user_id;
  const fav_product_id = req.params.product_id;

  // INSERT INTO product_favorites SET user_id=11, fav_product_id=1;
  const sql = `INSERT INTO product_favorites SET fav_product_id=?,user_id=?`;
  const [result] = await db.query(sql, [fav_product_id, user_id]);
  console.log("sql", sql);

  res.json({ result, success: !!result.affectedRows });
});

// 刪除
router.delete("/favorite/delete/:product_id", async (req, res) => {
  const user_id = parseInt(req.query.user_id) || 1;

  const sql = `DELETE FROM product_favorites WHERE user_id=${user_id} and fav_product_id=?`;
  const [result] = await db.query(sql, req.params.product_id);

  res.json({ result, success: !!result.affectedRows });
});

export default router;

// 取得收藏夾標題
router.get("/favorite_title/api/:title_user_id", async (req, res) => {
  const title_user_id = +req.params.title_user_id;
  let success = false;
  let rows = [];
  // user_id
  const sql = `SELECT * FROM \`favorite_title\`  WHERE \`title_user_id\`=${title_user_id} `;

  console.log("title_user_id", title_user_id);

  [rows] = await db.query(sql);
  if(rows.length >0){
    success = true;
  }
  res.json({
    success,
    rows,
  });
});

// 編輯收藏夾標題
router.put("/favorite_title/edit/:title_user_id", async (req, res) => {
  const title_user_id = +req.params.title_user_id;
  const title = req.body.title;

  // UPDATE `product_favorites` SET `section`=1 WHERE `favorite_id`=7;
  const sql = "UPDATE `favorite_title` SET `title`=? WHERE `title_user_id`=?";
  const [result] = await db.query(sql, [title, title_user_id]);

  res.json({ result, success: !!result.affectedRows });
});

// 新增收藏夾標題
router.post("/favorite_title/add/:title_user_id", async (req, res) => {
  const title_user_id = +req.params.title_user_id;
  const title = req.body.title;

  // INSERT INTO product_favorites SET user_id=11, fav_product_id=1;
  const sql = `INSERT INTO favorite_title SET title=?,title_user_id=?`;
  const [result] = await db.query(sql, [title, title_user_id]);

  res.json({ result, success: !!result.affectedRows });
});

// 取得評價資料
router.get("/review", async (req, res) => {
  let success = false;
  let rows = [];
  const product_id = parseInt(req.query.product_id)|| 0;
// console.log('product_id',product_id);
  
  // SELECT * FROM `orders` JOIN order_details ON `orders`.`id`=order_id WHERE `order_product_id`=6;
  // SELECT * FROM `orders` JOIN order_details ON `orders`.`id`=order_id JOIN users ON users.user_id=member_id WHERE `order_product_id`=6;
  // const sql = `SELECT * FROM order_details WHERE order_product_id=${product_id}`;
  const sql = `SELECT * FROM orders JOIN order_details ON orders.id=order_id JOIN users ON users.user_id=member_id WHERE order_product_id=${product_id}`;

  [rows] = await db.query(sql);

   // 格式化 order_date
   rows.forEach((v) => {
    const m = moment(v.order_date);
    if (m.isValid()) {
      v.order_date = m.format(dateFormat);
    } else {
      v.order_date = "無日期";
    }
  });
  
  if(rows.length >0){
    success = true;
  }
  res.json({
    success,
    rows,
  });
});

// 上傳圖片
router.post("/upload", upload.single("file"), async (req, res) => {
  console.log('File received:', req.file);
  const output = {
    success: false,
    error: "",
    file: req.file,
  };
  if (!req.file) {
    output.error = "上傳失敗!!";
    return res.status(400).json(output);
  }
  res.json({ filePath: req.file.filename });
});