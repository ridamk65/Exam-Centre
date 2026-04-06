const bcrypt = require("bcryptjs");
const db = require("../database/db.js");

const fingerprintId = "admin";
const password = "admin123";

db.get("SELECT * FROM users WHERE LOWER(fingerprintId) = LOWER(?) AND role = ?", 
    [fingerprintId, "admin"], 
    async (err, admin) => {
        if (err) return console.error(err);
        if (!admin) return console.log("Admin not found in DB query!");
        console.log("Admin found:", admin);
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log("Password match:", isMatch);
});
