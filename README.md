# Quick Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database

## Option 1: Local MongoDB Setup (Ubuntu/Linux)

```bash
# Install MongoDB
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify MongoDB is running
sudo systemctl status mongodb
```

## Option 2: MongoDB Cloud (Recommended for Demo)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `server/.env` file with your connection string

## Running the Application

### Terminal 1 - Backend Server

```bash
cd server
npm install
npm start
# Should see: "Server is running on port 5000"
# Should see: "Connected to MongoDB"
```

### Terminal 2 - Frontend Server

```bash
cd client
npm install
npm run dev
# Should see: "Local: http://localhost:5173/"
```

### Testing the Application

1. Open browser to `http://localhost:5173`
2. Click "Sign up here" to create an account
3. Fill in the registration form
4. After successful registration, you'll see the dashboard
5. Add some sample transactions to test the features

## Sample Test Data

Try adding these transactions to see the charts in action:

**Income:**

- Description: "Salary", Amount: 3000, Type: Income, Category: "Salary"
- Description: "Freelance", Amount: 500, Type: Income, Category: "Freelance"

**Expenses:**

- Description: "Groceries", Amount: 150, Type: Expense, Category: "Food"
- Description: "Gas", Amount: 60, Type: Expense, Category: "Transport"
- Description: "Coffee", Amount: 25, Type: Expense, Category: "Food"
- Description: "Movie tickets", Amount: 30, Type: Expense, Category: "Entertainment"

## Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: Make sure MongoDB is running
- **Port 5000 in use**: Change PORT in `.env` file
- **CORS errors**: Ensure frontend URL is correct in server code

### Frontend Issues

- **API connection failed**: Check if backend server is running on port 5000
- **Charts not showing**: Add some transactions first
- **Login/Register not working**: Check browser console for errors

## Project Structure Summary

```
personal-finance-tracker/
├── server/          # Express.js backend
│   ├── models/      # MongoDB schemas
│   ├── routes/      # API endpoints
│   ├── controllers/ # Business logic
│   └── middleware/  # Authentication
└── client/          # React frontend
    ├── components/  # UI components
    └── contexts/    # State management
```
