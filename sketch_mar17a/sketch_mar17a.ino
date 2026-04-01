#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

/*
 * EduVault-X: RFID Hardware Authentication
 * ESP8266 + MFRC522
 */

#define SS_PIN D2
#define RST_PIN D1

MFRC522 mfrc522(SS_PIN, RST_PIN);

// --- WiFi Configuration ---
const char* ssid = "Pavi";
const char* password = "Pavithra";

// --- Backend Configuration ---
// Based on your Serial Monitor (10.32.135.198), your PC IP is likely 10.32.135.231
const char* serverUrl = "http://10.201.129.231:5000/api/auth/verify";

WiFiClient client;

void setup() {
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

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

    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", "eduvault_secure");

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
        Serial.println("👉 Troubleshooting Link: https://github.com/esp8266/Arduino/issues/3364");
        Serial.println("💡 Check if PC Firewall is blocking port 5000.");
        Serial.println("💡 Use 'ipconfig' to verify PC IP matches serverUrl.");
      }
    }

    http.end();
  } else {
    Serial.println("🚫 WiFi Disconnected");
  }
}
