// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose
	.connect(
		process.env.MONGODB_URI || "mongodb://localhost:27017/finance-tracker",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log("Connected to MongoDB"))
	.catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// Basic route for testing
app.get("/", (req, res) => {
	res.json({ message: "Personal Finance Tracker API is running!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
	console.log(`Server is running on port ${PORT}`);
});
