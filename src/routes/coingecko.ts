import express, { Request, Response } from 'express';
import * as coingeckoOps from '../api/coingecko';
let router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    let result = await coingeckoOps.getCoinGeckoPrices();
    res.send(JSON.stringify(result));
})

router.get('/:id', async function (req: Request, res: Response) {
    let result = await coingeckoOps.getCoinGeckoPrice(req.params.id.toString());
    res.send(JSON.stringify(result));
})

module.exports = router