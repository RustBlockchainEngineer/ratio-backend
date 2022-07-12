import express, { Request, Response } from 'express';
import { getAllRaydiumLpTokenPrices } from '../api/raydium';

let router = express.Router();

router.get('/', async function (req: Request, res: Response) {

    let result = await getAllRaydiumLpTokenPrices();

    res.send(JSON.stringify(result));
})

module.exports = router