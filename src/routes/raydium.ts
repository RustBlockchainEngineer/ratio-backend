import express, { Request, Response } from 'express';
import { getAllRaydiumLpTokenPrices } from '../api/raydium';

let router = express.Router();

router.get('/', async function (req: Request, res: Response) {

    let result = await getAllRaydiumLpTokenPrices();

    if(result){
        res.send(JSON.stringify(result))
    }else{
        res.status(404).send({ error: 'POOL NOT FOUND'});
    }
})

module.exports = router