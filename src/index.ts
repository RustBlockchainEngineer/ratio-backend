
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { cacheInit } from './api/cacheList'

let bodyParser = require('body-parser')

// const https = require('https');
// const fs = require('fs');

let platforms = require('./routes/platforms');
let lpairs = require('./routes/lpairs');
let tokens = require('./routes/tokens');
let ratioconfig = require('./routes/ratioconf');
let transactions = require('./routes/transactions');
let users = require('./routes/users');
let authRouter = require('./routes/auth');

const app = express();

const allowedOrigins: Array<string | RegExp> = process.env.API_CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
allowedOrigins.push(/\.netlify.app$/);

app.use(bodyParser.json());

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

app.use('/auth', authRouter);
app.use('/users', users);

// Init the tokens and LPs cache list;
cacheInit();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Ratio Finance Backend listening on port ${port}`)
})

// https.createServer({
//     key: fs.readFileSync('/etc/letsencrypt/live/backend.ratio.finance/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/backend.ratio.finance/fullchain.pem'),
// }, app).listen(port, () => {
//     console.log(`HTTPS Server running on port ${port}`);
// });
