const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema(
  {
    type: {
      type: Number,
    },
    name: {
      type: String,
    },
    room_id: {
      type: Number,
    },
    status: {
      type: String,
    },
    mode: {
      type: String,
    },
    remote: {
      type: Boolean,
    },
    position: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Device", sensorSchema);
