require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("./database/db"); // initialize SQLite

const app = express();

// --- Security Middleware ---
app.use(helmet());                                      // HTTP security headers
app.use(cors({
    origin: process.env.CLIENT_URL || "*",              // Restrict in production
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,                          // 15 minutes
    max: 100,                                           // 100 requests per window
    message: { message: "Too many requests, slow down." }
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

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

app.listen(5000, () => {
    console.log("✅ Server running on port 5000");
});
