const url = "http://localhost:5000/api/auth/verify";

fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": "eduvault_secure",
        "User-Agent": "ESP8266HTTPClient/1.0"
    },
    body: JSON.stringify({
        fingerprintId: "3D0D522D",
        faceEncoding: "RFID_USER",
        paperData: "Exam Access"
    })
})
.then(res => res.json().then(data => ({ status: res.status, data })))
.then(result => console.log("Hardware Simulation Response:", result))
.catch(err => console.error("Error:", err));
