const express = require('express');
const app = express();
const json2emv = require('./routers/json2emv');

app.use(express.json());
app.use(json2emv);

module.exports = app;