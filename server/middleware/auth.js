const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT token and authenticate user
const authenticateToken = async (req, res, next) => {
	try {
		// Get token from Authorization header
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

		// Check if token exists
		if (!token) {
			return res
				.status(401)
				.json({ message: "Access denied. No token provided." });
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Find user and attach to request
		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			return res
				.status(401)
				.json({ message: "Invalid token. User not found." });
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid token." });
	}
};

module.exports = authenticateToken;
