//Dependencies
const express = require('express');
const router = express.Router();

// importing controllers
const transactionController = require('../controllers/transaction');

// controllers for specific routes
router.post('/makeTransaction', transactionController.make_transaction);
router.get('/accountTransactionHistory/:address', transactionController.transactions_of_account);

// exporting module
module.exports = router;