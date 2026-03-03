const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../database/db");
const crypto = require("crypto");
const { recordAccess } = require("../services/blockchainService");

exports.verifyAccess = async (req, res) => {
    const { fingerprintId, faceEncoding, paperData } = req.body;

    db.get(
        "SELECT * FROM users WHERE fingerprintId = ?",
        [fingerprintId],
        async (err, user) => {
            if (err || !user) {
                return res.status(401).json({ message: "User not found" });
            }

            if (user.faceEncoding !== faceEncoding) {
                return res.status(401).json({ message: "Face mismatch" });
            }

            const paperHash = crypto
                .createHash("sha256")
                .update(paperData)
                .digest("hex");

            try {
                const txHash = await recordAccess(user.id.toString(), paperHash, "enter");

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
                            txHash
                        });
                    }
                );

            } catch (blockErr) {
                res.status(500).json({ error: blockErr.message });
            }
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
    const { fingerprintId, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE fingerprintId = ? AND role = ?",
        [fingerprintId, "admin"],
        async (err, admin) => {
            if (err || !admin) {
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
