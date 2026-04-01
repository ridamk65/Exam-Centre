const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../database/db");
const crypto = require("crypto");
const { recordAccess } = require("../services/blockchainService");

exports.verifyAccess = async (req, res) => {
    const { fingerprintId, faceEncoding, paperData } = req.body;

    if (!fingerprintId || fingerprintId.length < 5) {
        return res.status(400).json({ error: "Invalid UID" });
    }

    db.get(
        "SELECT * FROM users WHERE fingerprintId = ?",
        [fingerprintId],
        async (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                console.log("❌ Unauthorized access:", fingerprintId);
                return res.status(403).json({ success: false, message: "Access Denied" });
            }

            if (user.faceEncoding !== faceEncoding) {
                return res.status(401).json({ message: "Face mismatch" });
            }

            const paperHash = crypto
                .createHash("sha256")
                .update(paperData)
                .digest("hex");

            let txHash = null;
            try {
                txHash = await recordAccess(user.id.toString(), paperHash, "enter");
            } catch (blockErr) {
                console.warn(`[BLOCKCHAIN-WARN] Blockchain unavailable, logging without txHash: ${blockErr.message}`);
            }

            db.run(
                `INSERT INTO access_logs (userId, paperHash, action, blockchainTx)
             VALUES (?, ?, ?, ?)`,
                [user.id, paperHash, "enter", txHash],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({
                        success: true,
                        paperHash,
                        txHash,
                        blockchainRecorded: !!txHash
                    });
                }
            );
        }
    );
};

exports.registerUser = (req, res) => {
    const { name, fingerprintId, faceEncoding, role } = req.body;

    const query = `
      INSERT INTO users (name, fingerprintId, faceEncoding, role)
      VALUES (?, ?, ?, ?)
    `;

    db.run(query, [name, fingerprintId, faceEncoding, role || "officer"], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        res.json({ success: true, userId: this.lastID });
    });
};

// ADMIN LOGIN
exports.adminLogin = (req, res) => {
    let { fingerprintId, password } = req.body;
    
    // Safety trim and lower-case comparison
    fingerprintId = (fingerprintId || "").trim();
    console.log(`[AUTH-DEBUG] Attempting admin login for: [${fingerprintId}] (lowercase search)`);

    db.get(
        "SELECT * FROM users WHERE LOWER(fingerprintId) = LOWER(?) AND role = ?",
        [fingerprintId, "admin"],
        async (err, admin) => {
            if (err) {
                console.error("[AUTH-DEBUG] DB error:", err.message);
                return res.status(500).json({ error: err.message });
            }
            if (!admin) {
                console.log(`[AUTH-DEBUG] FAILED - Admin user not found with fingerprint [${fingerprintId}] and role [admin]`);
                return res.status(400).json({ message: "Admin not found" });
            }

            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: admin.id, role: admin.role },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.json({ token });
        }
    );
};

// GET ALL USERS
exports.getUsers = (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// GET ACCESS LOGS
exports.getLogs = (req, res) => {
    const query = `
        SELECT access_logs.*, users.name as userName, users.fingerprintId as user
        FROM access_logs 
        JOIN users ON access_logs.userId = users.id
        ORDER BY access_logs.timestamp DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Map database fields to frontend expected fields if necessary
        const logs = rows.map(row => ({
            ...row,
            status: row.blockchainTx ? 'Granted' : 'Denied' // Simple logic for mock replacement
        }));
        res.json(logs);
    });
};

// GET DASHBOARD STATS
exports.getDashboardStats = (req, res) => {
    const stats = {
        totalUsers: 0,
        verifiedLogs: 0,
        lastAccess: null,
        chartData: []
    };

    db.get("SELECT COUNT(*) as count FROM users", [], (err, userRes) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalUsers = userRes.count;

        db.get("SELECT COUNT(*) as count FROM access_logs WHERE blockchainTx IS NOT NULL", [], (err, logRes) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.verifiedLogs = logRes.count;

            db.get("SELECT timestamp FROM access_logs ORDER BY timestamp DESC LIMIT 1", [], (err, lastRes) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.lastAccess = lastRes ? lastRes.timestamp : null;

                const chartQuery = `
                    SELECT date(timestamp) as date, COUNT(*) as accesses 
                    FROM access_logs 
                    WHERE blockchainTx IS NOT NULL
                    GROUP BY date(timestamp)
                    ORDER BY date(timestamp) ASC
                    LIMIT 7
                `;
                db.all(chartQuery, [], (err, chartRows) => {
                    if (err) return res.status(500).json({ error: err.message });
                    stats.chartData = chartRows;
                    res.json(stats);
                });
            });
        });
    });
};
