const express = require("express");
const router = express.Router();
const {
	createTransaction,
	getTransactions,
	deleteTransaction,
	getSummary,
	getCategories,
	getCategoryBreakdown,
	getMonthlyData,
} = require("../controllers/transactionController");
const authenticateToken = require("../middleware/auth");

// All transaction routes require authentication
router.use(authenticateToken);

// POST /api/transactions - Create a new transaction
router.post("/", createTransaction);

// GET /api/transactions - Get all transactions for user
router.get("/", getTransactions);

// DELETE /api/transactions/:id - Delete a transaction
router.delete("/:id", deleteTransaction);

// GET /api/transactions/summary - Get financial summary
router.get("/summary", getSummary);

// GET /api/transactions/categories - Get user's categories
router.get("/categories", getCategories);

// GET /api/transactions/summary/category - Get expense breakdown by category
router.get("/summary/category", getCategoryBreakdown);

// GET /api/transactions/summary/monthly - Get monthly income vs expense data
router.get("/summary/monthly", getMonthlyData);

module.exports = router;
