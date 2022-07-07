import express, { Request, Response } from 'express';
import { medianPriceList, recentPriceList } from "../api/cacheList";
let router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    res.send(JSON.stringify(recentPriceList));
});

router.get('/medianprices',async function(req: Request, res: Response){
    res.send(JSON.stringify(medianPriceList));
});

router.get('/:id', async function (req: Request, res: Response) {
    if(recentPriceList[req.params.id])
        res.send(JSON.stringify(recentPriceList[req.params.id]));
    else
        res.status(404).send({ error: 'Token not found' });
});

module.exports = router