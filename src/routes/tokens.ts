import express, { Request, Response } from 'express';
import { getAllTokens, getToken, addToken, addNewPriceToken, getLatestTokenPrice, updateToken, deleteToken } from '../api/tokens'
import { isNotSafe } from '../utils/utils';
import { authorize } from '../middlewares/auth';
import { UserRole } from '../models/model';

let router = express.Router();

router.get('/', async function (req: Request, res: Response) {

    await getAllTokens(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id', async function (req: Request, res: Response) {
    await getToken(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})
router.get('/:id/price', async function (req: Request, res: Response) {
    await getLatestTokenPrice(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['address_id', 'symbol', 'icon'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }

    let result = await addToken(req.body);
    res.send(JSON.stringify(result));
})

router.post('/:id/price', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['price', 'confidence'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addNewPriceToken(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.put('/:id', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['symbol', 'icon'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await updateToken(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    let result = await deleteToken(req.params.id);
    res.send(JSON.stringify(result));
})

module.exports = router