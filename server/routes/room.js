const mqtt = require("mqtt");
const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Device = require("../models/Device");
const moment = require("moment");
const auth = require("../middlewares/auth");

var mqtt_topic_room_sub = "room";

var client = mqtt.connect({
  host: "broker.mqttdashboard.com",
});

// get all
router.get("/", async (req, res) => {
  try {
    const result = await Room.find().sort({
      field: "desc",
      _id: -1,
    });
    return res.json({
      code: "200",
      message: "Success",
      rooms: result,
    });
  } catch (error) {
    res.status(400).json({
      message: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const roomItem = req.body;
    const result = await Room.create(roomItem);
    return res.json(result);
  } catch (error) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// get device in room
router.get("/:id", getDeviceInRoom, (req, res) => {
  res.json({
    code: "200",
    message: "Success",
    device: req.device,
  });
});

// Updating one
router.patch("/:id", getDeviceIdInRoom, async (req, res) => {
  if (req.body.status != null) {
    req.device.forEach((element) => {
      element.status = req.body.status;
    });
  }

  client.publish(
    mqtt_topic_room_sub,
    req.device.length + ":" + req.listIdDevice + "-" + req.body.status
  );
  console.log(req.device.length);

  console.log(req.listIdDevice);
  try {
    req.device.forEach((element) => {
      updatedDevice = element.save();
    });
    res.json({
      code: "200",
      message: "Success",
      device: req.device,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//Middleware to findById Room
async function getDeviceInRoom(req, res, next) {
  let device;
  try {
    device = await Device.find({
      room_id: req.params.id,
    });

    if (device == null) {
      return res.status(404).json({
        message: "Cannot find device",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
  req.device = device;
  next();
}

//Middleware to findById Room
async function getDeviceIdInRoom(req, res, next) {
  let device;
  let listIdDevice = [];
  try {
    device = await Device.find({
      room_id: req.params.id,
    });

    if (device == null) {
      return res.status(404).json({
        message: "Cannot find device",
      });
    } else {
      device.forEach((element) => {
        listIdDevice.push(element.id);
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
  req.device = device;
  req.listIdDevice = listIdDevice.toString();
  next();
}

module.exports = router;
