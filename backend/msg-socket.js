import express from "express";
import db from "./utils/connect-mysql.js";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
var socket_list = [];
var online = [];
const app = express();
// 註冊樣板引擎
app.set("view engine", "ejs");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  // socket_list.push(socket);
  // console.log("有人連上了", socket_list.length);

  socket.on("joinRoom", async ({ room, username }) => {
    if (
      !online.some(
        (item) => item.room === room && item.username === username
      ) &&
      username !== "管理員"
    ) {
      online.push({ room, username, id: socket.id });
      console.log("***server online", online);
      // 更新並廣播 AllRoom
      io.emit("AllRoom", online);
    }

    try {
      const [results] = await db.query(
        "SELECT * FROM messages WHERE room = ?",
        [room]
      );
      io.emit("joinRoom", { room, username });
      socket.emit("history", results);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      socket.emit("error", { message: "Failed to fetch chat history" });
    }

    socket.join(room);
    console.log(`${username} joined room: ${room}`);
  });


 socket.on("disconnect", () => {
  online = online.filter((value) => value.id !== socket.id);
  console.log("online", online);
  
  // 更新並廣播 AllRoom
  io.emit("AllRoom", online);
});

  // 傳給後台
  socket.on("AllRoom", () => {
    socket.join("AllRoom");
    io.to("AllRoom").emit("AllRoom", online);
  });

  socket.emit("AllRoom", online);

  socket.on("chat message", async (data) => {
    const { room, username, type, message } = data;
    console.log(`${username} :${type}, ${message}`);
    try {
      const [results] = await db.query(
        "INSERT INTO messages (room, username,type, message) VALUES (?, ?, ?,?)",
        [room, username, type, message]
      );
      io.to(room).emit("chat message", { username, type, message });
      console.log("INSERT INTO OK");
    } catch (error) {
      console.error("Error fetching chat history:", error);
      socket.emit("error", { message: "Failed to fetch chat history" });
    }
  });
});

server.listen(4040, () => {
  console.log("server running at http://localhost:4040");
});

// ************
// 設定靜態內容資料夾
app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

// ************ 404 要放在所有的路由設定之後
app.use((req, res) => {
  res.status(404).send(`<h1>找不到頁面</h1>`);
});
