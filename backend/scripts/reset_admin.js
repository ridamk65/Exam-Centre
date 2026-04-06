const bcrypt = require("bcryptjs");
const db = require("../database/db.js");

bcrypt.hash("admin123", 10).then(hash => {
    db.run("UPDATE users SET password = ? WHERE fingerprintId = 'admin'", [hash], (err) => {
        if (err) console.error(err);
        else console.log("Password reset mapped to admin123");
    });
});
