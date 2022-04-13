
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { cacheInit } from './api/cacheList'
import {geckoPricesService} from './api/coingecko'
let platforms = require('./routes/platforms');
let lpairs = require('./routes/lpairs');
let tokens = require('./routes/tokens');
let ratioconfig = require('./routes/ratioconf');
let transactions = require('./routes/transactions');
let users = require('./routes/users');
let authRouter = require('./routes/auth');
let coingecko = require('./routes/coingecko');
let saber = require('./routes/saberPoolSizes');
let oracle = require('./routes/oracle');

const app = express();

const allowedOrigins: Array<string | RegExp> = process.env.API_CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
allowedOrigins.push(/\.netlify.app$/);

const options: cors.CorsOptions = {
    origin: allowedOrigins
};
console.log(options);
app.use(cors(options));

app.use(express.json());

app.use('/platforms', platforms);
app.use('/lpairs', lpairs);
app.use('/tokens', tokens);
app.use('/ratioconfig', ratioconfig);
app.use('/transaction', transactions);
app.use('/coingecko',coingecko);
app.use('/saberlpprices',saber);;

app.use('/auth', authRouter);
app.use('/users', users);
app.use('/oracle', oracle);

// Init the tokens and LPs cache list;
cacheInit();
console.log("Cache initialized");

//COINGECKOINTERVAL Minutes for ingesting from Coingecko prices
const ciongeckointerval =  process.env.COINGECKOINTERVAL || 30

geckoPricesService(+ciongeckointerval);
console.log("CionGecko service initialized");

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Ratio Finance Backend listening on port ${port}`)
})
