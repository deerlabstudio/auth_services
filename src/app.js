const express = require('express');

/** Express App */
const app = express();

/** Middlewares */
const errorHandler = require('./middlewares/error-handler');

/** controllers */
const HealthCheckController = require('./controllers/HealthCheck');
const AuthCheckController = require('./controllers/Auth');

app.use(express.json());
app.use(new HealthCheckController(express.Router()).router);
app.use(new AuthCheckController(express.Router()).router);
app.use(errorHandler());

module.exports = app;