import multer from "multer";
import { v4 } from "uuid";

const extMap = {
  "image/jpg": ".jpg",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const fileFilter = (req, file, callback) => {
  callback(null, !!extMap[file.mimetype]);
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // 這邊路徑以 node (根目錄)本身為主，不是模組所在位置
    callback(null, "public/img");
  },
  filename: (req, file, callback) => {
    const f = v4() + extMap[file.mimetype];
    callback(null, f);
  },
});

export default multer({ fileFilter, storage });
