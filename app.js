//Dependencies
'use strict';
const express = require('express');
const app = express();
const cors = require('cors')({origin: true});
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// enabling CORS
app.use(cors);

// routes
const accountRoutes = require('./api/routes/account');
const transactionRoutes = require('./api/routes/transaction');

// redirecting to Routes
app.use('/account', accountRoutes);
app.use('/data', dataRoutes);
app.use('/transaction', transactionRoutes);

// exporting app module
module.exports = app;