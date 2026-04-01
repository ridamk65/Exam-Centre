const HARDWARE_API_KEY = process.env.HARDWARE_API_KEY || "eduvault_secure";

// --- 1. API Key Auth ---
// Only requests carrying the correct x-api-key header are allowed.
// All other callers (browsers, scanners, etc.) are rejected with 401.
exports.verifyApiKey = (req, res, next) => {
    if (req.headers["x-api-key"] !== HARDWARE_API_KEY) {
        console.warn(`[HARDWARE-BLOCKED] Invalid API key from ${req.ip}`);
        return res.status(401).json({ error: "Unauthorized API access" });
    }
    next();
};

// --- 2. Device-Level Security ---
// Only requests from ESP devices (ESP8266 / ESP32) are accepted.
// Prevents browser-based manual attacks or scripted probing.
exports.verifyHardwareDevice = (req, res, next) => {
    const userAgent = req.headers["user-agent"] || "";
    const isESP = userAgent.includes("ESP8266") || userAgent.includes("ESP32");

    if (!isESP) {
        console.warn(`[HARDWARE-BLOCKED] Invalid device agent: "${userAgent}" from ${req.ip}`);
        return res.status(403).json({ error: "Invalid device. Hardware access only." });
    }
    next();
};
