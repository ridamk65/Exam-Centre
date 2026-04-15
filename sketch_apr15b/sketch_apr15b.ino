#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

// 🔐 RFID Pins
#define SS_PIN D2
#define RST_PIN D1
MFRC522 mfrc522(SS_PIN, RST_PIN);

// 🌐 WiFi Credentials
#define WIFI_SSID     "Kumar's A36"
#define WIFI_PASSWORD "123456789"

// 🌐 Backend
#define SERVER_URL "// 🌐 Backend
#define SERVER_URL "http://10.73.72.231:5000/api/auth/verify"
#define API_KEY    "eduvault_secure"

WiFiClient client;

void setup() {
  Serial.begin(115200);

  SPI.begin();
  mfrc522.PCD_Init();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi Connected");
  Serial.print("ESP IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Check card
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  // Read UID
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uid += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(mfrc522.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();

  Serial.println("🎴 Card UID: " + uid);

  // Send to backend
  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;
    http.begin(client, SERVER_URL);

    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", API_KEY);
    http.addHeader("User-Agent", "ESP8266");

    String json = "{\"fingerprintId\":\"" + uid + "\"}";

    int httpCode = http.POST(json);

    if (httpCode > 0) {
      Serial.print("✅ HTTP Code: ");
      Serial.println(httpCode);

      String response = http.getString();
      Serial.println("📄 Response: " + response);
    } else {
      Serial.print("❌ Error: ");
      Serial.println(http.errorToString(httpCode));
    }

    http.end();
  } else {
    Serial.println("🚫 WiFi Disconnected");
  }

  delay(2000);
}