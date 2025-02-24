const express = require('express');
const mongoose = require('mongoose');
const mqtt = require("mqtt");
const http = require("http");
const cors = require("cors");
// const { Server } = require("socket.io");
const { createSensorDataService } = require("./services/sensorDataService");

const app = express();
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Cho phép tất cả FE truy cập WebSocket
//   },
// });


// Cấu hình CORS
app.use(cors({
  origin: "http://localhost:3000", // Đổi thành frontend của bạn
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
const port = 8081;

const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');

// Middleware xử lý dữ liệu JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', webRoutes);
app.use('/v1/api/', apiRoutes);

// WebSocket kết nối
// io.on("connection", (socket) => {
//   console.log("🔌 New WebSocket connection", socket.id);

//   socket.on("disconnect", () => {
//     console.log("❌ WebSocket disconnected", socket.id);
//   });
// });

// 👉 Kết nối MQTT Broker
const mqttClient = mqtt.connect("mqtt://192.168.0.107:1886", {
  username: "user1",
  password: "123456",
});

mqttClient.on("connect", () => {
  console.log("📡 Connected to MQTT Broker");
  mqttClient.subscribe("data/sensors", (err) => {
    if (!err) {
      console.log("🔔 Subscribed to topic: data/sensors");
    } else {
      console.error("❌ Error subscribing:", err);
    }
  });
});

// 👉 Xử lý lỗi kết nối MQTT
mqttClient.on("error", (err) => {
  console.error("❌ MQTT Connection Error:", err);
  mqttClient.end();
});

// 👉 Nhận dữ liệu từ MQTT, lưu vào MongoDB & gửi đến WebSocket
mqttClient.on("message", async (topic, message) => {
  if (topic === "data/sensors") {
    try {
      const data = JSON.parse(message.toString());

      // Kiểm tra dữ liệu hợp lệ
      if (!data.temperature || !data.humidity || !data.light) {
        console.warn("⚠️ Invalid data format:", data);
        return;
      }

      const savedData = await createSensorDataService(data);
      console.log("✅ Data saved to MongoDB:", savedData);

      // Gửi dữ liệu mới đến tất cả client qua WebSocket
      // io.emit("sensorDataUpdate", savedData);
    } catch (error) {
      console.error("❌ Error processing MQTT message:", error);
    }
  }
});

// 👉 Khởi động server & kết nối MongoDB
(async () => {
  try {
    await connection();
    server.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
})();


