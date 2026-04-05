require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const morgan = require("morgan");
const timeout = require("connect-timeout");
require("./database/db"); // initialize SQLite

const app = express();

app.use(timeout("5s"));
app.use((req, res, next) => {
    if (!req.timedout) next();
});

// --- Log incoming requests ---
app.use(morgan("dev"));

app.use((req, res, next) => {
    if (req.url === "/api/auth/verify") {
        console.log(`[HARDWARE-INCOMING] Scan detected! Method: ${req.method}`);
    } else {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
});

// --- Security Middleware ---
app.use(helmet());                                      // HTTP security headers
app.use(xss());                                         // Prevent XSS attacks
app.use(cors({
    origin: process.env.CLIENT_URL || "*",              // Restrict in production
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(rateLimit({
  windowMs: 60 * 1000,   // 1 minute window
  max: 100,              // 100 requests per IP per minute
  message: { error: "Too many requests, please slow down." }
}));

// --- Body Parsing ---
app.use(express.json({ limit: "1mb" }));

// --- Routes ---
app.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "EduVault-X Backend Running"
    });
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/papers", require("./routes/paperRoutes"));

// --- 404 Unknown Route Handler ---
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

app.listen(5000, "0.0.0.0", () => {
    console.log("✅ Server running on port 5000 (Available on Network)");
});
