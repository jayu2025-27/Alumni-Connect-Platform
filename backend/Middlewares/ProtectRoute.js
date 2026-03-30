const jwt = require("jsonwebtoken");
const { User, Alumni } = require("../Models/db");

const protectRoute = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try finding user in Students table
        let user = await User.findByPk(decoded.userId);
        let role = 'student';

        // If not found, try Alumni table
        if (!user) {
            user = await Alumni.findByPk(decoded.userId);
            role = 'alumni';
        }

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        req.user = user;
        req.user.role = role; // Manually assign role
        next();
    } catch (error) {
        console.error("ProtectRoute error:", error);
        return res.status(400).json({ message: "Invalid token or user not found." });
    }
};

module.exports = protectRoute;
