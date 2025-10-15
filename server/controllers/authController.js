const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper function to generate JWT token
const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register a new user
const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User with this email already exists" });
		}

		// Hash password
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create new user
		const user = new User({
			username,
			email,
			password: hashedPassword,
		});

		await user.save();

		// Generate token
		const token = generateToken(user._id);

		// Send response (don't include password)
		res.status(201).json({
			message: "User registered successfully",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Login user
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		// Generate token
		const token = generateToken(user._id);

		// Send response
		res.json({
			message: "Login successful",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get current user info (for checking if token is valid)
const getMe = async (req, res) => {
	try {
		// req.user is set by the auth middleware
		res.json({
			user: {
				id: req.user._id,
				username: req.user.username,
				email: req.user.email,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

module.exports = {
	register,
	login,
	getMe,
};
