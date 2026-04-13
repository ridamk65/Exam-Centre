const express = require("express");
const router = express.Router();

// Placeholder for future paper routes
router.get("/", (req, res) => {
    res.json({ message: "Papers route" });
});

module.exports = router;
