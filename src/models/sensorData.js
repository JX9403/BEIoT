const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete')

const sensorSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  light: {
    type: Number,
    required: true
  }
},
  {
    timestamps: true
  });

sensorSchema.plugin(mongoose_delete, { overrideMethods: 'all' })

// Tạo model từ schema
const SensorData = mongoose.model("SensorData", sensorSchema);

module.exports = SensorData;