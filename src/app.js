const express = require('express');
const app = express();
const json2emv = require('./routers/json2emv');
const emv2json = require('./routers/emv2json');

app.use(express.json());
app.use(json2emv);
app.use(emv2json);

module.exports = app;