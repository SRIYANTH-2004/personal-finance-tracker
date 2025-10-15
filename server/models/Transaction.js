const mongoose = require("mongoose");

// Helper function to standardize category names
const standardizeCategory = (category) => {
	if (!category) return "Other";

	// Remove extra spaces and convert to Title Case
	return category
		.trim()
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

// Define the Transaction schema
const transactionSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		amount: {
			type: Number,
			required: true,
			min: 0.01,
		},
		type: {
			type: String,
			required: true,
			enum: ["Income", "Expense"],
		},
		category: {
			type: String,
			required: true,
			set: standardizeCategory, // Automatically standardize category when saving
		},
		date: {
			type: Date,
			default: Date.now,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// Create and export the Transaction model
module.exports = mongoose.model("Transaction", transactionSchema);
