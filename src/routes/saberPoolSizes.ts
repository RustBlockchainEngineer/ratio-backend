import express, { Request, Response } from 'express';
import {getSaberLpTokenPrice, getSaberLpTokenPrices,getUsdrPrice} from '../api/saber';
let router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    let result = await getSaberLpTokenPrices();
    res.send(JSON.stringify(result));
})

router.get('/:id', async function(req: Request, res: Response) {
    let result = await getSaberLpTokenPrice(req.params.id);
    if(result){
        res.send(JSON.stringify(result))
    }else{
        res.status(404).send({ error: 'POOL NOT FOUND'});
    }
});

router.get('/usdrprice',async function(req: Request, res: Response){
    let result = await getUsdrPrice();
    res.send(JSON.stringify(result));
});

module.exports = router