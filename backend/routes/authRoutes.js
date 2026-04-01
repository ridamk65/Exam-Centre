const express = require("express");
const { verifyAccess, registerUser, adminLogin, getUsers, getLogs, getDashboardStats } = require("../controllers/authController.js");
const { verifyAdminToken } = require("../middleware/authMiddleware.js");

const router = express.Router();

// --- Public/Hardware Routes ---
router.post("/verify", verifyAccess);      // Protected by x-api-key within controller
router.post("/admin-login", adminLogin);   // Public route to generate JWT

// --- Protected Admin Routes ---
router.post("/register", verifyAdminToken, registerUser);
router.get("/users", verifyAdminToken, getUsers);
router.get("/logs", verifyAdminToken, getLogs);
router.get("/stats", verifyAdminToken, getDashboardStats);

module.exports = router;
