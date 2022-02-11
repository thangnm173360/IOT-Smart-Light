const mqtt = require("mqtt");
const express = require("express");
const router = express.Router();
const Device = require("../models/Device");
const moment = require("moment");

var mqtt_topic_light_sub = "light";
var mqtt_topic_light_mode_sub = "lightMode";

var client = mqtt.connect({
  host: "broker.mqttdashboard.com",
});

// get all
router.get("/", async (req, res) => {
  try {
    const result = await Device.find().sort({
      field: "asc",
      _id: -1,
    });
    return res.json(result);
  } catch (error) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// add device
router.post("/", async (req, res) => {
  try {
    const deviceItem = req.body;
    const result = await Device.create(deviceItem);
    return res.json({
      code: "200",
      message: "Success",
      result,
    });
  } catch (error) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// get device
router.get("/:id", getDevice, (req, res) => {
  res.send(req.device.status);
});

//Updating one
router.patch("/:id", getDevice, async (req, res) => {
  if (req.body.status != null) {
    req.device.status = req.body.status;

    client.publish(mqtt_topic_light_sub, req.params.id + "-" + req.body.status);
    console.log(req.params.id + "-" + req.body.status);
  }
  try {
    const updatedDevice = await req.device.save();
    res.json({ code: "200", message: "Success", updatedDevice });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//Updating one
router.patch("/mode/:id", getDevice, async (req, res) => {
  if (req.body.mode != null) {
    req.device.mode = req.body.mode;

    client.publish(
      mqtt_topic_light_mode_sub,
      req.params.id + "-" + req.body.mode
    );
    console.log(req.params.id + "-" + req.body.mode);
  }
  try {
    const updatedDevice = await req.device.save();
    res.json({ code: "200", message: "Success", updatedDevice });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//Middleware to findById Device
async function getDevice(req, res, next) {
  let device;
  try {
    device = await Device.findOne({
      _id: req.params.id,
    });

    if (device == null) {
      return res.status(404).json({
        message: "Cannot find subscriber",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
  req.device = device;
  console.log(device.status);
  next();
}

module.exports = router;
