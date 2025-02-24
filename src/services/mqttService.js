const mqtt = require("mqtt");

const mqttClient = mqtt.connect("mqtt://192.168.0.107:1886", {
  username: "user1",
  password: "123456",
});



module.exports = mqttClient; // ✅ Export mqttClient duy nhất
