
const { default: mqtt } = require("mqtt");
const { getAllActivityHistoryService, createActivityHistoryService, deleteActivityHistoryService } = require("../services/activityHistoryService");


const mqttClient = mqtt.connect("mqtt://192.168.0.107:1886", {
  username: "user1",
  password: "123456",
});

mqttClient.on("connect", () => {
  console.log("📡 MQTT Client đã kết nối thành công!");
});

mqttClient.on("error", (err) => {
  console.error("❌ Lỗi kết nối MQTT:", err);
});

const postCreateActivityHistory = async (req, res) => {
  if (!mqttClient) {
    return res.status(500).json({ error: "MQTT Client chưa được khởi tạo!" });
  }

  const topicMap = {
    "fan": "devices/led1",
    "light": "devices/led2",
    "air-conditioner": "devices/led3"
  };

  let { device, action } = req.body;

  if (!device || !action) {
    return res.status(400).json({ error: "Thiếu thông tin device hoặc action" });
  }

  const topic = topicMap[device];
  const message = action.toUpperCase(); // Đảm bảo "ON" hoặc "OFF"

  mqttClient.publish(topic, message, { qos: 1 }, (err) => {
    if (err) {
      console.error("❌ Lỗi gửi MQTT:", err);
      return res.status(500).json({ error: "Gửi lệnh MQTT thất bại" });
    } else {
      console.log(`📤 Đã gửi MQTT: ${topic} -> ${message}`);
      return res.status(200).json({ message: "Success" });
    }
  });
};


const getAllActivityHistory = async (req, res) => {
  try {
    // Lấy limit, page, và các tham số lọc từ request query
    let limit = req.query.limit || 10;  // Mặc định 10 bản ghi mỗi trang
    let page = req.query.page || 1;      // Mặc định trang đầu tiên
    let filterType = req.query.filterType || 'createdAt';  // Loại filter
    let filterValue = req.query.filterValue || null;        // Giá trị filter
    let sortBy = req.query.sortBy || 'createdAt';     // Sắp xếp theo trường createdAt mặc định
    let sortOrder = req.query.sortOrder || 'desc';    // Mặc định sắp xếp giảm dần (desc)

    // console.log("check sortOrderReq", req.query.sortOrder)
    // console.log({ limit, page, filterType, filterValue, sortBy, sortOrder })

    // Lấy dữ liệu từ service
    const { data, totalRows } = await getAllActivityHistoryService(
      limit,
      page,
      filterType,
      filterValue,
      sortBy,
      sortOrder
    );

    // Tính tổng số trang
    const totalPages = Math.ceil(totalRows / limit);

    // Trả về dữ liệu cùng với tổng số row và số trang
    return res.status(200).json({
      EC: 0,
      data: data,
      totalRows: totalRows,  // Tổng số row trong cơ sở dữ liệu
      totalPages: totalPages // Tổng số trang
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EC: 1,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại!'
    });
  }
}


const deleteActivityHistory = async (req, res) => {
  let id = req.body.id;
  // console.log(id)
  let result = await deleteActivityHistoryService(id);

  return res.status(200).json({
    EC: 0,
    data: result
  })
}

module.exports = {
  getAllActivityHistory, postCreateActivityHistory, deleteActivityHistory
}