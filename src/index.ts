import express from 'express';

import { cacheInit } from './api/cacheList'

//let whitelist = require('./routes/whitelist');
let platforms = require('./routes/platforms');
let lpairs = require('./routes/lpairs');
let tokens = require('./routes/tokens');
let ratioconfig = require('./routes/ratioconf');
let transactions = require('./routes/transactions');

const app = express();

app.use(express.json());

app.use('/platforms', platforms);
app.use('/lpairs', lpairs);
app.use('/tokens', tokens);
app.use('/ratioconfig', ratioconfig);
app.use('/transaction', transactions);

// Init the tokens and LPs cache list;
cacheInit();

const port = 3000;
app.listen(port, () => {
    console.log(`rf-engine start on port ${port}.`);
});
