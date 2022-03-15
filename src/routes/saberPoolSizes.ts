import express, { Request, Response } from 'express';
import {getSaberLpTokenPrice, getSaberLpTokenPrices,NETWORK,} from '../api/saber';
let router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    let result = await getSaberLpTokenPrices(NETWORK.DEVNET);
    res.send(JSON.stringify(result));
})

router.get('/:id', async function(req: Request, res: Response) {
    let result = await getSaberLpTokenPrice(NETWORK.DEVNET,req.params.id);
    if(result){
        res.send(JSON.stringify(result))
    }else{
        res.status(404).send({ error: 'POOL NOT FOUND'});
    }
});

module.exports = router