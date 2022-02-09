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
#define mqtt_topic_pub "dht"   //Tạo topic tên là demo
#define mqtt_topic_sub_light "light"   //Tạo topic tên là light
#define mqtt_topic_sub_room "room"   //Tạo topic tên là room


const uint16_t mqtt_port = 1883; //Port của CloudMQTT

// khai bao id thiet bi
#define ID_LIGHT_1 "61f02aaca1b2061da0c15042"
#define ID_LIGHT_2 "61f20b6bb388c021f4145322"

//Khai báo chân của cảm biến nhiệt độ
const int DHTTYPE = DHT11;
const int DHTPIN = 5;
#define ledPin 4
#define ledPin2 0

DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient client(espClient);

long lastMsg = 0;
char msg[50];

int getDevice(String id) {
  if (id == ID_LIGHT_1) return ledPin;
  if (id == ID_LIGHT_2) return ledPin2;
}

void setup() {
  Serial.begin(115200);
  //set up wifi
  setup_wifi();
  //set up sensor
  pinMode(ledPin, OUTPUT); // Khai báo đèn id 1
  pinMode(ledPin2, OUTPUT); // Khai báo đèn id 1


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
  String message = "";
  String status = "";
  boolean flagStatus = false;
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.println("] ");

  if (strcmp(topic, mqtt_topic_sub_light) == 0 ) {
    String id = "";
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
    if (status.equals("on")) {
      digitalWrite(getDevice(id), HIGH);
    } else {
      digitalWrite(getDevice(id), LOW);
    }
  } else if (strcmp(topic, mqtt_topic_sub_room) == 0 ) {
    String id = "";
    String numberDeviceStr = "";
    int i;
    for (i = 0; i < length; i++) {
      char c = (char)payload[i];
      if (c == ':') {
        break;
      }
      else {
        numberDeviceStr.concat(c);
      }
    }
    Serial.println(numberDeviceStr);
    int numberDevice = atoi(numberDeviceStr.c_str());
    String devices[numberDevice] ;
    int indexDevice = 0;
    for (i++; i < length; i++)
    {
      char c = (char)payload[i];
//      Serial.print(c);
      message.concat(c);
      if ( c == ',') {
        Serial.println(id);
        devices[indexDevice] = id;
        id = "";
        indexDevice++;
        continue;
      }
      if (c == '-') {
        devices[indexDevice] = id;
        Serial.println(id);
        indexDevice++;
        flagStatus = true;
        continue;
      }
      if (flagStatus) {
        status.concat(c);
      } else {
        id.concat(c);
      }
    }
    for ( i = 0 ; i < numberDevice; i++) {
      if (status.equals("on")) {
        digitalWrite(getDevice(devices[i]), HIGH);
      } else {
        digitalWrite(getDevice(devices[i]), LOW);
      }
    }
  }
  Serial.print("Message: ");
    Serial.println(message);


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
      client.subscribe(mqtt_topic_sub_light);
      client.subscribe(mqtt_topic_sub_room);
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
  if (now - lastMsg > 2000) {
    //đọc nhiệt độ, độ ẩm
    float h = dht.readHumidity();    //Đọc độ ẩm
    float t = dht.readTemperature(); //Đọc nhiệt độ
    //    Serial.println(h);
    //    Serial.println(t);
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
