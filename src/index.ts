import express from 'express';
import { buildPriceChangeSpot } from './api/pyth';


let whitelist = require('./routes/whitelist');
let pyth = require('./routes/pyth');
let platforms = require('./routes/platforms');
let lppairs = require('./routes/lppairs');
let lpassets = require('./routes/lpassets');
let lppairaprs = require('./routes/lppairaprs');
let tokens = require('./routes/tokens');

buildPriceChangeSpot("devnet");


const app = express();

app.use(express.json());


app.use('/platforms', platforms);
app.use('/lppairs', lppairs);
app.use('/lpassets', lpassets);
app.use('/lppairaprs', lppairaprs);
app.use('/whitelist', whitelist);
app.use('/tokens', tokens);
app.use('/price', pyth);



const port = 3000;
app.listen(port, () => {
    console.log(`rf-engine start on port ${port}.`);
});
