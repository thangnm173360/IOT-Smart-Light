#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <string.h>

// Cập nhật thông tin wifi
#define ssid "Tester"
#define password "gaohunter"
//#define ssid "Onii-chan"
//#define password "88888888"

const long utcOffsetInSeconds = 25200;
// Define NTP Client to get time
WiFiUDP ntpUDP;
// NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

// Thông tin về MQTT Broker
#define mqtt_server "broker.mqttdashboard.com" // Địa chỉ server
const uint16_t mqtt_port = 1883;               // Port của CloudMQTT

#define mqtt_topic_pub "dht"                  // Tạo topic tên là demo
#define mqtt_topic_sub_light "light"          // Tạo topic tên là light
#define mqtt_topic_sub_light_mode "lightMode" // Tạo topic tên là light mode
#define mqtt_topic_sub_room "room"            // Tạo topic tên là room

WiFiClient espClient;
PubSubClient client(espClient);

// khai bao id thiet bi
#define LIVING_ROOM_LIGHT_ID_1 "61f02aaca1b2061da0c15042"
#define LIVING_ROOM_LIGHT_ID_2 "61f20b6bb388c021f4145322"
#define LIVING_ROOM_LIGHT_ID_3 "62063468f0aba209c8df2938"
#define LIVING_ROOM_LIGHT_ID_4 "6206744d13bd519e1cec062d"
#define BATH_ROOM_LIGHT_ID_1 "62067a4313bd519e1cec062e"
#define BATH_ROOM_LIGHT_ID_2 "6208be521a0e1581c31d06d5"
#define BATH_ROOM_LIGHT_ID_3 "6208be5e1a0e1581c31d06d6"
#define BED_ROOM_LIGHT_ID_1 "61f206b4cede7b34c08952ce"
#define BED_ROOM_LIGHT_ID_2 "62067a7f13bd519e1cec0630"
#define KITCHEN_LIGHT_ID_1 "62067a6213bd519e1cec062f"
#define KITCHEN_LIGHT_ID_2 "62076d5213bd519e1cec0631"

// Khai báo chân của cảm biến nhiệt độ
const int DHTTYPE = DHT11;
const int DHTPIN = 10 ; // D7
DHT dht(DHTPIN, DHTTYPE); 

// Khai báo chân cảm biến hồng ngoại
int IRSensor = 16 ;// D8

// living room
#define ledLivingRoom1 13 // D7
#define ledLivingRoom2 5  // D1
#define ledLivingRoom3 4  // D2
#define ledLivingRoom4 0  // D3
// bathroom
#define ledBathRoom1 2  // D4
#define ledBathRoom2 14 // D5
#define ledBathRoom3 12 // D6
// bedroom
//#define ledBedRoom1 13 // D7
//#define ledBedRoom2 15 // D8

// kitchen
//#define ledKitchen1 3 
//#define ledKitchen2 1

long lastMsg = 0;
char msg[50];
String modePin1 = "MANUAL";

int getDevice(String id)
{
  if (id == LIVING_ROOM_LIGHT_ID_1)
    return ledLivingRoom1;
  if (id == LIVING_ROOM_LIGHT_ID_2)
    return ledLivingRoom2;
  if (id == LIVING_ROOM_LIGHT_ID_3)
    return ledLivingRoom3;
  if (id == LIVING_ROOM_LIGHT_ID_4)
    return ledLivingRoom4;
  if (id == BATH_ROOM_LIGHT_ID_1)
    return ledBathRoom1;
  if (id == BATH_ROOM_LIGHT_ID_2)
    return ledBathRoom2;
  if (id == BATH_ROOM_LIGHT_ID_3)
    return ledBathRoom3;
//  if (id == BED_ROOM_LIGHT_ID_1)
//    return ledBedRoom1;
//  if (id == BED_ROOM_LIGHT_ID_2)
//    return ledBedRoom2;
//  if (id == KITCHEN_LIGHT_ID_1)
//    return ledKitchen1;
//  if (id == KITCHEN_LIGHT_ID_1)
//    return ledKitchen2;
return -1;
}

void setup()
{
    Serial.begin(115200);
  // set up wifi
  setup_wifi();
  // set up sensor
  pinMode(ledLivingRoom1, OUTPUT); // Khai báo đèn id 1
  pinMode(ledLivingRoom2, OUTPUT); // Khai báo đèn id 1
  pinMode(ledLivingRoom3, OUTPUT); // Khai báo đèn id 1
  pinMode(ledLivingRoom4, OUTPUT); // Khai báo đèn id 1
  pinMode(ledBathRoom1, OUTPUT);   // Khai báo đèn id 1
  pinMode(ledBathRoom2, OUTPUT);   // Khai báo đèn id 1
  pinMode(ledBathRoom3, OUTPUT);   // Khai báo đèn id 1
//  pinMode(ledBedRoom1, OUTPUT);    // Khai báo đèn id 1
//  pinMode(ledBedRoom2, OUTPUT);    // Khai báo đèn id 1
//  pinMode(ledKitchen1, OUTPUT);    // Khai báo đèn id 1
//  pinMode(ledKitchen2, OUTPUT);    // Khai báo đèn id 1

  pinMode(IRSensor, INPUT);

  dht.begin();
  //  timeClient.begin();
  // set up pubsub
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

// Hàm kết nối wifi
void setup_wifi()
{
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  //  digitalWrite(D6, 1);
  //  digitalWrite(D2, 1);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// Hàm call back để nhận dữ liệu.
void callback(char *topic, byte *payload, unsigned int length)
{
  String message = "";
  String status = "";
  boolean flagStatus = false;
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.println("] ");

  if (strcmp(topic, mqtt_topic_sub_light) == 0)
  {
    String id = "";
    for (int i = 0; i < length; i++)
    {
      char c = (char)payload[i];
      Serial.print(c);
      message.concat(c);
      if (c == '-')
      {
        flagStatus = true;
        continue;
      }
      if (flagStatus)
      {
        status.concat(c);
      }
      else
      {
        id.concat(c);
      }
    }
    Serial.print(message);
    if (status.equals("on"))
    {
      digitalWrite(getDevice(id), HIGH);
    }
    else
    {
      digitalWrite(getDevice(id), LOW);
    }
  }
  else if (strcmp(topic, mqtt_topic_sub_room) == 0)
  {
    String id = "";
    String numberDeviceStr = "";
    int i;
    for (i = 0; i < length; i++)
    {
      char c = (char)payload[i];
      if (c == ':')
      {
        break;
      }
      else
      {
        numberDeviceStr.concat(c);
      }
    }
    Serial.println(numberDeviceStr);
    int numberDevice = atoi(numberDeviceStr.c_str());
    String devices[numberDevice];
    int indexDevice = 0;
    for (i++; i < length; i++)
    {
      char c = (char)payload[i];
      //      Serial.print(c);
      message.concat(c);
      if (c == ',')
      {
        Serial.println(id);
        devices[indexDevice] = id;
        id = "";
        indexDevice++;
        continue;
      }
      if (c == '-')
      {
        devices[indexDevice] = id;
        Serial.println(id);
        indexDevice++;
        flagStatus = true;
        continue;
      }
      if (flagStatus)
      {
        status.concat(c);
      }
      else
      {
        id.concat(c);
      }
    }
    for (i = 0; i < numberDevice; i++)
    {
      if (status.equals("on"))
      {
        digitalWrite(getDevice(devices[i]), HIGH);
      }
      else
      {
        digitalWrite(getDevice(devices[i]), LOW);
      }
    }
  }
  else if (strcmp(topic, mqtt_topic_sub_light_mode) == 0)
  {
    String id = "";
    for (int i = 0; i < length; i++)
    {
      char c = (char)payload[i];
      Serial.print(c);
      message.concat(c);
      if (c == '-')
      {
        flagStatus = true;
        continue;
      }
      if (flagStatus)
      {
        status.concat(c);
      }
      else
      {
        id.concat(c);
      }
    }
    Serial.print(message);
    modePin1 = status;
  }
  Serial.print("Message: ");
  Serial.println(message);
}

// Hàm reconnect thực hiện kết nối lại khi mất kết nối với MQTT Broker
void reconnect()
{
  // Chờ tới khi kết nối
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    // Thực hiện kết nối với mqtt
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str()))
    {
      Serial.println("connected");
      // Khi kết nối sẽ publish thông báo
      client.publish(mqtt_topic_pub, "ESP_reconnected");
      // ... và nhận lại thông tin này
      client.subscribe(mqtt_topic_sub_light);
      client.subscribe(mqtt_topic_sub_light_mode);
      client.subscribe(mqtt_topic_sub_room);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Đợi 5s
      delay(5000);
    }
  }
}

void loop()
{
  // Kiểm tra kết nối
  if (!client.connected())
  {
    reconnect();
  }

  client.loop();
  long now = millis();
  if (now - lastMsg > 2000)
  {
    //đọc nhiệt độ, độ ẩm
    float h = dht.readHumidity();    //Đọc độ ẩm
    float t = dht.readTemperature(); //Đọc nhiệt độ
//        Serial.println(h);
//        Serial.println(t);
    delay(500);

    lastMsg = now;
    StaticJsonBuffer<300> JSONbuffer;
    JsonObject &JSONencoder = JSONbuffer.createObject();
    JSONencoder["humidityAir"] = h;
    JSONencoder["temperature"] = t;

    char JSONmessageBuffer[100];
    JSONencoder.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    client.publish(mqtt_topic_pub, JSONmessageBuffer);
  }
  delay(20);

  if (modePin1 == "AUTO")
  {
    int statusSensor = digitalRead(IRSensor);
    if (statusSensor == HIGH)
    {
      digitalWrite(ledLivingRoom1, HIGH);
      delay(3000);
    }
    else
    {
      digitalWrite(ledLivingRoom1, LOW);
    }
  }
}
