import express, { Request, Response } from 'express';
import { tokenPriceList } from "../api/cacheList";
import { CoinGeckoTokenList } from "../models/model";
let router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    res.send(JSON.stringify(tokenPriceList));
})

router.get('/:id', async function (req: Request, res: Response) {
    
    if(req.params.id in Object.values(CoinGeckoTokenList))
        res.send(JSON.stringify(tokenPriceList[req.params.id]));
    else
        res.status(404).send({ error: 'Token not found' });
})

module.exports = router