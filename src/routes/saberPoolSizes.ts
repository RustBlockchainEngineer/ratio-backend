import express, { Request, Response } from 'express';
import {getSaberLpTokenPrices,NETWORK} from '../api/saber';
let router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    let result = await getSaberLpTokenPrices(NETWORK.DEVNET);
    res.send(JSON.stringify(result));
})

module.exports = router