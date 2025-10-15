const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 30,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
	},
	{
		timestamps: true, // Automatically add createdAt and updatedAt fields
	}
);

// Create and export the User model
module.exports = mongoose.model("User", userSchema);
