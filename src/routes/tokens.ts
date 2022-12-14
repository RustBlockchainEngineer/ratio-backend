import express, { Request, Response } from 'express';
import { getAllTokens, getToken, addToken, deleteToken } from '../api/tokens'
import { isNotSafe } from '../utils/utils';
import { authorize } from '../middlewares/auth';
import { UserRole, pricesSources, MainToken } from '../models/model';
import { medianPriceList,cacheList } from "../api/cacheList";
let router = express.Router();

router.get('/', async function (req: Request, res: Response) {

    await getAllTokens(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/prices', async function (req: Request, res: Response) {
    res.send(JSON.stringify(medianPriceList));
})

router.get('/main', async function (req: Request, res: Response) {
    const main_tokens = [MainToken.USDC,MainToken.USDH,MainToken.USDT,MainToken.UST,MainToken.UXD];
    res.send(JSON.stringify(main_tokens));
})

router.get('/pricessources', async function (req: Request, res: Response) {
    res.send(JSON.stringify(pricesSources));
})

router.get('/:id', async function (req: Request, res: Response) {
    await getToken(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id/price', async function (req: Request, res: Response) {
    let token_symbol = undefined;
    if(Object.keys(cacheList).includes("_"+req.params.id))
        token_symbol = cacheList["_"+req.params.id];
    else
        token_symbol = req.params.id;
        
    if(medianPriceList[token_symbol]){
        res.send(JSON.stringify(medianPriceList[token_symbol]));
    }
    else
        res.status(404).send({ error: 'Token price not found' });
})

router.post('/', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['address_id', 'symbol', 'icon','token_ids'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }

    let result = await addToken(req.body["address_id"],req.body);
    res.send(JSON.stringify(result));
})

router.put('/:id', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['symbol', 'icon','token_ids'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addToken(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    let result = await deleteToken(req.params.id);
    res.send(JSON.stringify(result));
})

module.exports = router