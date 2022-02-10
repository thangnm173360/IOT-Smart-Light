// var mqtt = require('mqtt')

// var options = {
//     host: 'e30223f15d5b405fa13e5b0286467d75.s2.eu.hivemq.cloud',
//     port: 8883,
//     protocol: 'mqtts',
//     username: 'vietcong',
//     password: '<your-password>'
// }

// //initialize the MQTT client
// var client = mqtt.connect(options);

// //setup the callbacks
// client.on('connect', function () {
//     console.log('Connected');
// });

// client.on('error', function (error) {
//     console.log(error);
// });

// client.on('message', function (topic, message) {
//     //Called each time a message is received
//     console.log('Received message:', topic, message.toString());
// });

// // subscribe to topic 'my/test/topic'
// client.subscribe('my/test/topic');

// // publish message 'Hello' to topic 'my/test/topic'
// client.publish('my/test/topic', 'Hello');

require("dotenv").config();

const mqtt = require("mqtt");
const mongoose = require("mongoose");
const Sensor = require("./models/Sensor");

//========================= create server socket local
const aedes = require("aedes")();
const httpServer = require("http").createServer();
const ws = require("websocket-stream");
const port = 9001;

ws.createServer({ server: httpServer }, aedes.handle);

httpServer.listen(port, function () {
  console.log("websocket local server listening on port ", port);
});

//========================================================= client mqtt
// Connect to mongodb database
mongoose.connect(process.env.DATABASE_URL || "localhost:27017/iot", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));

var options = {
  host: "broker.mqttdashboard.com",
  port: 1883,
};

var client = mqtt.connect(options);

client.on("connect", function () {
  client.subscribe("demo", function (err) {
    if (!err) {
      console.log("Subcribing to MQTT Broker!");
      //test
      client.publish(
        "demo",
        JSON.stringify({
          humidityAir: 22,
          temperature: 33,
        })
      );
    }
  });
});

client.on("message", function (topic, message) {
  //Called each time a message is received
  console.log("Received message:", topic, message.toString());
});

db.once("open", () => {
  console.log("Connected to Database");
  client.on("message", async function (topic, message) {
    //test
    //console.log(`${topic.toString()}=>${message.toString()}`);

    // message is Buffer
    let content = JSON.parse(message.toString());
    // clientLocal.publish("local", message.toString());
    console.log(content);

    //Save to db
    //Create a new Sensor
    const sensor = new Sensor({
      humidityLand: content.humidityLand,
      humidityAir: content.humidityAir,
      temperature: content.temperature,
    });
    try {
      const savedSensor = await sensor.save();
      console.log("[Saved DB] =>", savedSensor);
    } catch (err) {
      console.error(err);
    }
  });
});

// db.once("open", () => {
//   console.log("Connected to Database");
//   client.on("message", async function (topic, message) {
//     //test
//     //console.log(`${topic.toString()}=>${message.toString()}`);

//     // message is Buffer
//     let content = JSON.parse(message.toString());
//     clientLocal.publish("local", message.toString());
//     console.log(content);

//     //Save to db
//     //Create a new Sensor
//     const sensor = new Sensor({
//       humidityLand: content.humidityLand,
//       humidityAir: content.humidityAir,
//       temperature: content.temperature,
//     });
//     try {
//       const savedSensor = await sensor.save();
//       console.log("[Saved DB] =>", savedSensor);
//     } catch (err) {
//       console.error(err);
//     }
//   });
// });
