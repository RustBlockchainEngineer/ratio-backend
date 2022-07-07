import express, { Request, Response } from 'express';
import {getSaberLPTokenPriceByPoolName, getAllSaberLpTokenPrices} from '../api/saber';
let router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    let result = await getAllSaberLpTokenPrices();
    res.send(JSON.stringify(result));
})

router.get('/:id', async function(req: Request, res: Response) {
    let result = await getSaberLPTokenPriceByPoolName(req.params.id);
    if(result){
        res.send(JSON.stringify(result))
    }else{
        res.status(404).send({ error: 'POOL NOT FOUND'});
    }
});

module.exports = router