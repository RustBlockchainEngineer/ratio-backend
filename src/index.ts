import express from 'express';
import { buildPriceChangeSpot } from './api/pyth';

let rates = require('./routes/rates');
let whightlist = require('./routes/whightlist');
let pyth = require('./routes/pyth');

buildPriceChangeSpot("mainnet-beta");


const app = express();

app.use('/rates', rates);
app.use('/whitelist', whightlist);
app.use('/pyth', pyth);


const port = 3000;
app.listen(port, () => {
    console.log(`rf-engine start on port ${port}.`);
});
