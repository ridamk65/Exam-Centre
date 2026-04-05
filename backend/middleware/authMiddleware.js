const jwt = require("jsonwebtoken");

exports.verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN format

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing from environment variables!");
        return res.status(500).json({ success: false, message: "Server configuration error." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token." });
        }
        
        // Ensure only users with the 'admin' role can proceed
        if (decoded.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied. Admins only." });
        }

        // Attach the decoded admin data to the request
        req.user = decoded;
        next();
    });
};
