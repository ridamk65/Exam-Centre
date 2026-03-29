const express = require("express");
const { verifyAccess, registerUser, adminLogin } = require("../controllers/authController.js");

const router = express.Router();

router.post("/verify", verifyAccess);
router.post("/register", registerUser);
router.post("/admin-login", adminLogin);
router.get("/users", require("../controllers/authController.js").getUsers);
router.get("/logs", require("../controllers/authController.js").getLogs);
router.get("/stats", require("../controllers/authController.js").getDashboardStats);

module.exports = router;
