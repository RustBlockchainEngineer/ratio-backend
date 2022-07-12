
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { cacheInit } from './api/cacheList'
import { geckoPricesService } from './api/coingecko'
let platforms = require('./routes/platforms');
let lpairs = require('./routes/lpairs');
let pools = require('./routes/pools');
let tokens = require('./routes/tokens');
let ratioconfig = require('./routes/ratioconf');
let transactions = require('./routes/transactions');
let users = require('./routes/users');
let authRouter = require('./routes/auth');
let rpcAuthRouter = require('./routes/rpc-auth');
let coingecko = require('./routes/coingecko');
let saber = require('./routes/saberPoolSizes');
let raydium = require('./routes/raydium');

const app = express();

const allowedOrigins = ['https://demo.ratio.finance','https://dev.ratio.finance','https://app.ratio.finance','http://localhost:3000'];

//const allowedOrigins: Array<string | RegExp> = process.env.API_CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

//allowedOrigins.push(/\.netlify.app$/);

const options: cors.CorsOptions = {
    origin: allowedOrigins
};
console.log(options);
app.use(cors(options));

app.use(express.json());

app.use('/platforms', platforms);
app.use('/lpairs', lpairs);
app.use('/pools', pools);
app.use('/tokens', tokens);
app.use('/ratioconfig', ratioconfig);
app.use('/transaction', transactions);
app.use('/coingecko', coingecko);
app.use('/saberlpprices', saber);;

app.use('/auth', authRouter);
app.use('/rpcauth', rpcAuthRouter);
app.use('/users', users);
app.use('/raydium', raydium);

// Init the tokens and LPs cache list;
cacheInit();
console.log("Cache initialized");

//COINGECKOINTERVAL Minutes for ingesting from Coingecko prices
const ciongeckointerval = process.env.COINGECKOINTERVAL || 30

geckoPricesService(+ciongeckointerval);
console.log("CoinGecko service initialized");

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Ratio Finance Backend listening on port ${port}`)
})
