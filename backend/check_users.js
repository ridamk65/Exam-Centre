const db = require("./database/db");
db.all("SELECT id, name, fingerprintId, role, password FROM users", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
});
