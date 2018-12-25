//Dependencies
const express = require('express');
const router = express.Router();

// importing controllers
const accountController = require('../controllers/account');

// controllers for specific routes
router.get('/createFundingAccount', accountController.create_funding_account);
router.post('/createNewAccount', accountController.create_new_account);
router.post('/accountInfo', accountController.account_Info);

// exporting module
module.exports = router;