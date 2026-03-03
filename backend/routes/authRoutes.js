const express = require("express");
const { verifyAccess, registerUser, adminLogin } = require("../controllers/authController.js");

const router = express.Router();

router.post("/verify", verifyAccess);
router.post("/register", registerUser);
router.post("/admin-login", adminLogin);

module.exports = router;
