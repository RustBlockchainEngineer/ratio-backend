import express from 'express';

import { getSpotPriceChange, getSpotPriceChangeC } from '../api/pyth';

let router = express.Router();


router.get('/spot', async function (req, res) {

    let result = await getSpotPriceChange();
    res.send(JSON.stringify(result));
})


router.get('/spot/:currency', async function (req, res) {

    let result = await getSpotPriceChangeC(req.params.currency);
    res.send(JSON.stringify(result));
})


module.exports = router