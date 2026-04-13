const fs = require("fs");
const db = require("../database/db.js");

db.all("SELECT * FROM users;", [], (err, rows) => {
    if (err) console.error(err);
    else fs.writeFileSync("/tmp/db_users.json", JSON.stringify(rows, null, 2));
});
