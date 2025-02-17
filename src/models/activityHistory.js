const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete')

const activitySchema = new mongoose.Schema({
  device: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true
  });

activitySchema.plugin(mongoose_delete, { overrideMethods: 'all' })

// Tạo model từ schema
const ActivityHistory = mongoose.model("activityHistory", activitySchema);

module.exports = ActivityHistory;