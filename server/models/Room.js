const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  total_device: {
    type: Number,
  },
});

module.exports = mongoose.model("Room", sensorSchema);
