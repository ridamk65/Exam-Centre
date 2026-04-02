#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

/*
 * EduVault-X: RFID Hardware Authentication
 * ESP8266 + MFRC522
 *
 * ⚠️  CONFIGURE THESE BEFORE FLASHING:
 */

// --- WiFi Configuration (edit before flashing) ---
#define WIFI_SSID     "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// --- Backend Configuration ---
// Run `ipconfig` on your PC and set the IPv4 address here
#define SERVER_IP   "192.168.x.x"
#define SERVER_PORT "5000"
#define SERVER_URL  "http://" SERVER_IP ":" SERVER_PORT "/api/auth/verify"

// --- API Key (must match .env HARDWARE_API_KEY on backend) ---
#define HARDWARE_API_KEY "eduvault_secure"

#define SS_PIN D2
#define RST_PIN D1

MFRC522 mfrc522(SS_PIN, RST_PIN);
WiFiClient client;

void setup() {
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Look for new cards
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uid += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(mfrc522.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();

  Serial.println("\n🎴 Card UID: " + uid);

  sendToBackend(uid);

  // Halt PICC
  mfrc522.PICC_HaltA();
  // Stop encryption on PCD
  mfrc522.PCD_StopCrypto1();

  delay(2000);
}

void sendToBackend(String uid) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    Serial.println("📡 Sending request to backend...");

    // Construct JSON payload
    String json = "{";
    json += "\"fingerprintId\":\"" + uid + "\",";
    json += "\"faceEncoding\":\"RFID_USER\",";
    json += "\"paperData\":\"Exam Access\"";
    json += "}";

    http.begin(client, SERVER_URL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", HARDWARE_API_KEY);
    // Required: backend checks User-Agent for ESP8266/ESP32
    http.addHeader("User-Agent", "ESP8266HTTPClient/1.0");

    int httpCode = http.POST(json);

    if (httpCode > 0) {
      Serial.print("✅ Response Code: ");
      Serial.println(httpCode);
      String payload = http.getString();
      Serial.println("📄 Response: " + payload);
    } else {
      Serial.print("❌ Connection Failed. Error: ");
      Serial.println(http.errorToString(httpCode).c_str());

      if (httpCode == -1) {
        Serial.println("👉 Troubleshooting: https://github.com/esp8266/Arduino/issues/3364");
        Serial.println("💡 Check if PC Firewall is blocking port 5000.");
        Serial.println("💡 Use 'ipconfig' to verify PC IP matches SERVER_IP define.");
      }
    }

    http.end();
  } else {
    Serial.println("🚫 WiFi Disconnected");
  }
}
