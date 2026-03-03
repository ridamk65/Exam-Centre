/**
 * seedAdmin.js — Run once to create the first admin account
 * Usage: node scripts/seedAdmin.js
 *
 * Set ADMIN_FINGERPRINT / ADMIN_PASSWORD in .env or edit below before running.
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../database/db");

const ADMIN_NAME = process.env.ADMIN_NAME || "Super Admin";
const ADMIN_FINGERPRINT = process.env.ADMIN_FINGERPRINT || "ADMIN_FP_001";
const ADMIN_FACE = process.env.ADMIN_FACE || "ADMIN_FACE_PLACEHOLDER";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@1234";

async function seed() {
    db.get(
        "SELECT * FROM users WHERE fingerprintId = ?",
        [ADMIN_FINGERPRINT],
        async (err, existing) => {
            if (err) {
                console.error("Database error:", err.message);
                process.exit(1);
            }

            if (existing) {
                console.log("⚠️  Admin already exists. Exiting.");
                process.exit(0);
            }

            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

            db.run(
                `INSERT INTO users (name, fingerprintId, faceEncoding, role, password)
                 VALUES (?, ?, ?, ?, ?)`,
                [ADMIN_NAME, ADMIN_FINGERPRINT, ADMIN_FACE, "admin", hashedPassword],
                function (err) {
                    if (err) {
                        console.error("❌ Seed failed:", err.message);
                        process.exit(1);
                    }

                    console.log("🔐 Admin created successfully!");
                    console.log(`   Name:        ${ADMIN_NAME}`);
                    console.log(`   FingerprintId: ${ADMIN_FINGERPRINT}`);
                    console.log(`   Password:    ${ADMIN_PASSWORD}  ← change this in production!`);
                    process.exit(0);
                }
            );
        }
    );
}

seed();
