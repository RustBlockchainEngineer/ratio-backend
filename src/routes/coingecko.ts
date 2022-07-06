import express, { Request, Response } from 'express';
import { tokenPriceList } from "../api/cacheList";
import { getMedianCoingeckoPrices } from '../api/coingecko';
let router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    res.send(JSON.stringify(tokenPriceList));
});

router.get('/medianprices',async function(req: Request, res: Response){
    const result = await getMedianCoingeckoPrices();
    res.send(JSON.stringify(result));
});

router.get('/:id', async function (req: Request, res: Response) {
    if(tokenPriceList[req.params.id])
        res.send(JSON.stringify(tokenPriceList[req.params.id]));
    else
        res.status(404).send({ error: 'Token not found' });
});

module.exports = router