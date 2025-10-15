const Transaction = require("../models/Transaction");

// Create a new transaction
const createTransaction = async (req, res) => {
	try {
		const { description, amount, type, category } = req.body;
		const userId = req.user._id;

		// Create new transaction
		const transaction = new Transaction({
			description,
			amount,
			type,
			category,
			user: userId,
		});

		await transaction.save();

		res.status(201).json({
			message: "Transaction created successfully",
			transaction,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get all transactions for the logged-in user
const getTransactions = async (req, res) => {
	try {
		const userId = req.user._id;

		// Get all transactions for this user, sorted by date (newest first)
		const transactions = await Transaction.find({ user: userId }).sort({
			date: -1,
		});

		res.json({ transactions });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user._id;

		// Find and delete transaction (only if it belongs to the user)
		const transaction = await Transaction.findOneAndDelete({
			_id: id,
			user: userId,
		});

		if (!transaction) {
			return res.status(404).json({ message: "Transaction not found" });
		}

		res.json({ message: "Transaction deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get financial summary (total income, expenses, balance)
const getSummary = async (req, res) => {
	try {
		const userId = req.user._id;

		// Calculate totals using MongoDB aggregation
		const summary = await Transaction.aggregate([
			{ $match: { user: userId } },
			{
				$group: {
					_id: "$type",
					total: { $sum: "$amount" },
				},
			},
		]);

		// Initialize values
		let totalIncome = 0;
		let totalExpenses = 0;

		// Process aggregation results
		summary.forEach((item) => {
			if (item._id === "Income") {
				totalIncome = item.total;
			} else if (item._id === "Expense") {
				totalExpenses = item.total;
			}
		});

		const balance = totalIncome - totalExpenses;

		res.json({
			totalIncome,
			totalExpenses,
			balance,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get unique categories used by the user
const getCategories = async (req, res) => {
	try {
		const userId = req.user._id;

		// Get distinct categories for this user
		const categories = await Transaction.distinct("category", { user: userId });

		res.json({ categories });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get expense breakdown by category (for pie chart)
const getCategoryBreakdown = async (req, res) => {
	try {
		const userId = req.user._id;

		// Aggregate expenses by category
		const breakdown = await Transaction.aggregate([
			{ $match: { user: userId, type: "Expense" } },
			{
				$group: {
					_id: "$category",
					total: { $sum: "$amount" },
				},
			},
			{ $sort: { total: -1 } }, // Sort by total amount (highest first)
		]);

		// Format the data for the frontend
		const categoryData = breakdown.map((item) => ({
			category: item._id,
			total: item.total,
		}));

		res.json({ categoryData });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get monthly income vs expense data (for bar chart)
const getMonthlyData = async (req, res) => {
	try {
		const userId = req.user._id;

		// Get data for the last 6 months
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		const monthlyData = await Transaction.aggregate([
			{
				$match: {
					user: userId,
					date: { $gte: sixMonthsAgo },
				},
			},
			{
				$group: {
					_id: {
						year: { $year: "$date" },
						month: { $month: "$date" },
						type: "$type",
					},
					total: { $sum: "$amount" },
				},
			},
			{ $sort: { "_id.year": 1, "_id.month": 1 } },
		]);

		// Format data for frontend
		const monthlyFormatted = {};

		monthlyData.forEach((item) => {
			const monthKey = `${item._id.year}-${item._id.month
				.toString()
				.padStart(2, "0")}`;

			if (!monthlyFormatted[monthKey]) {
				monthlyFormatted[monthKey] = { income: 0, expense: 0 };
			}

			if (item._id.type === "Income") {
				monthlyFormatted[monthKey].income = item.total;
			} else {
				monthlyFormatted[monthKey].expense = item.total;
			}
		});

		// Convert to array format
		const chartData = Object.keys(monthlyFormatted).map((month) => ({
			month,
			income: monthlyFormatted[month].income,
			expense: monthlyFormatted[month].expense,
		}));

		res.json({ chartData });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

module.exports = {
	createTransaction,
	getTransactions,
	deleteTransaction,
	getSummary,
	getCategories,
	getCategoryBreakdown,
	getMonthlyData,
};
