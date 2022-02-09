#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <string.h>

// Cập nhật thông tin wifi
//#define ssid "Tester"
//#define password "gaohunter"
#define ssid "Onii-chan"
#define password "88888888"
const long utcOffsetInSeconds = 25200;
// Define NTP Client to get time
WiFiUDP ntpUDP;
//NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

// Thông tin về MQTT Broker
#define mqtt_server "broker.mqttdashboard.com" // Địa chỉ server
#define mqtt_topic_pub "demo"   //Tạo topic tên là demo
#define mqtt_topic_sub "helo"

const uint16_t mqtt_port = 1883; //Port của CloudMQTT

//Khai báo chân của cảm biến nhiệt độ
const int DHTTYPE = DHT11;
const int DHTPIN = 5;
#define ledPin 4
//const int lamp1 = D2;
//int infrareStatus = 0;
//int statusLamp1 = 0, timerLamp1 = 0, checkLamp1 = 0;
//int statusLamp2 = 0, checkLamp2 = 0;
//int statusPan = 0, timerPan = 0, checkPan = 0;
//int statusLock = 0, checkLock = 0;
//long startLamp1, startPan;
DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient client(espClient);

long lastMsg = 0;
char msg[50];

void setup() {
  Serial.begin(115200);
  //set up wifi
  setup_wifi();
  //set up sensor
  //  pinMode(D0, INPUT_PULLUP); // Đặt chân D0 để làm cổng đọc digital
  //  pinMode(D6, INPUT_PULLUP);
  //  pinMode(D2, OUTPUT); //Đặt chân D2 ở chế độ output
  //  pinMode(D3, OUTPUT);
  //  pinMode(D4, OUTPUT);
  //  pinMode(D5, OUTPUT);
  pinMode(ledPin, OUTPUT); // Khai báo đèn id 1
  dht.begin();
  //  timeClient.begin();
  //set up pubsub
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

// Hàm kết nối wifi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  //  digitalWrite(D6, 1);
  //  digitalWrite(D2, 1);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// Hàm call back để nhận dữ liệu.
void callback(char* topic, byte* payload, unsigned int length) {
  //  Serial.println(topic);
  //  if (strcmp(topic, "lamp1") == 0) {
  //    char messing[200];
  //    for (int i = 0; i < length; i++) {
  //      messing[i] = payload[i];
  //      //Serial.print(timer[i]);
  //    }
  //    StaticJsonBuffer<200> subscribes;
  //    JsonObject& root = subscribes.parseObject(messing);
  //    const char* status = root["Status"];

  String message = "";
  String id = "";
  String status = "";
  boolean flagStatus = false;
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++)
  {
    char c = (char)payload[i];
    Serial.print(c);
    message.concat(c);
    if (c == '-') {
      flagStatus = true;
      continue;
    }
    if (flagStatus) {
      status.concat(c);
    } else {
      id.concat(c);
    }

  }
  Serial.print(message);
  int idint = atoi(id.c_str());

  switch (idint) {
    case 1:
      if (status.equals("on")) {
        digitalWrite(ledPin, HIGH);
      } else {
        digitalWrite(ledPin, LOW);
      }
      break;
  }
  //    statusLamp1 = int(status[0] - 48);
  //    Serial.println(statusLamp1);
  //    char timer[20];
  //    strcpy(timer, root["Timer"]);
  //    timerLamp1 = 0;
  //    for(int i = 0; timer[i] != '\0'; i++) {
  //        timerLamp1 = timerLamp1*10 + int(timer[i] - 48);
  //    }
  //    Serial.println(timerLamp1);
  //    checkLamp1 = 1;
  //    startLamp1 = millis();
  //  } else if (strcmp(topic, "lamp2") == 0) {
  //    char messing[200];
  //    for (int i = 0; i < length; i++) {
  //      messing[i] = payload[i];
  //      //Serial.print(timer[i]);
  //    }
  //    StaticJsonBuffer<200> subscribes;
  //    JsonObject& root = subscribes.parseObject(messing);
  //    const char* status = root["Status"];
  //    statusLamp2 = int(status[0] - 48);
  //    Serial.println(statusLamp2);
  //    digitalWrite(D3, statusLamp2);
  //  } else if (strcmp(topic, "lock") == 0) {
  //    char messing[200];
  //    for (int i = 0; i < length; i++) {
  //      messing[i] = payload[i];
  //      //Serial.print(timer[i]);
  //    }
  //    StaticJsonBuffer<200> subscribes;
  //    JsonObject& root = subscribes.parseObject(messing);
  //    const char* status = root["Status"];
  //    statusLock = int(status[0] - 48);
  //    Serial.println(statusLock);
  //    digitalWrite(D4, statusLock);
  //  } else if (strcmp(topic, "pan") == 0) {
  //    char messing[200];
  //    for (int i = 0; i < length; i++) {
  //      messing[i] = payload[i];
  //      //Serial.print(timer[i]);
  //    }
  //    StaticJsonBuffer<200> subscribes;
  //    JsonObject& root = subscribes.parseObject(messing);
  //    const char* status = root["Status"];
  //    statusPan = int(status[0] - 48);
  //    Serial.println(statusPan);
  //    char timer[20];
  //    strcpy(timer, root["Timer"]);
  //    timerPan = 0;
  //    for(int i = 0; timer[i] != '\0'; i++) {
  //        timerPan = timerPan*10 + int(timer[i] - 48);
  //    }
  //    Serial.println(timerPan);
  //    checkPan = 1;
  //    startPan = millis();
}



// Hàm reconnect thực hiện kết nối lại khi mất kết nối với MQTT Broker
void reconnect() {
  // Chờ tới khi kết nối
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Thực hiện kết nối với mqtt
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Khi kết nối sẽ publish thông báo
      client.publish(mqtt_topic_pub, "ESP_reconnected");
      // ... và nhận lại thông tin này
      client.subscribe(mqtt_topic_sub);
      client.subscribe("lamp1");
      client.subscribe("lamp2");
      client.subscribe("pan");
      client.subscribe("lock");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Đợi 5s
      delay(5000);
    }
  }
}


void loop() {
  // Kiểm tra kết nối
  if (!client.connected()) {
    reconnect();
  }

  client.loop();
  long now = millis();
  //  infrareStatus = digitalRead(D6);
  //
  //  if (infrareStatus == 0) {
  //      digitalWrite(D3, 1);
  //    }

  //  if (checkLamp1 && (now - startLamp1 > timerLamp1*1000*60)) {
  //      digitalWrite(D2, statusLamp1);
  //      checkLamp1 = 0;
  //    }
  //
  //   if (checkPan && (now - startPan > timerPan*1000*60)) {
  //      digitalWrite(D5, statusPan);
  //      checkPan = 0;
  //    }


  if (now - lastMsg > 2000) {
    //đọc nhiệt độ, độ ẩm
    float h = dht.readHumidity();    //Đọc độ ẩm
    float t = dht.readTemperature(); //Đọc nhiệt độ
    Serial.println(h);
    Serial.println(t);
    delay(500);

    lastMsg = now;
    StaticJsonBuffer<300> JSONbuffer;
    JsonObject& JSONencoder = JSONbuffer.createObject();
    JSONencoder["humidityAir"] = h;
    JSONencoder["temperature"] = t;

    char JSONmessageBuffer[100];
    JSONencoder.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    client.publish(mqtt_topic_pub, JSONmessageBuffer);
  }
  delay(20);
}
