import express, { Request, Response } from 'express';
import { getAllLPairs, getLPair, saveLPair, deleteLPair,deleteRewardToken,addLPairRewardToken } from '../api/lpairs'
import { getAllLPairAPRS, getlatestLPairAPRS, addLPairAPR, deleteAllLPairAPR } from '../api/lpairapr';
import { getAllLPairParam, getlatestLPairParam, addLPairParam, deleteAllLPairParam } from '../api/lpairparam';
import { isNotSafe } from '../utils/utils';
import { UserRole } from '../models/model';
import { authorize } from '../middlewares/auth';
let router = express.Router();

router.get('/',async function (req: Request, res: Response) {
    let role = UserRole.ADMIN;
    if ("user" in res.locals)
        role = res.locals.user.role;

    let result = await getAllLPairs(role,function (result) {
        res.send(JSON.stringify(result));
    });
})
router.get('/:id', async function (req: Request, res: Response) {
    let role = UserRole.ADMIN;
    if ("user" in res.locals)
        role = res.locals.user.role;

    let result = await getLPair(role,req.params.id, function (result) {
        if (result)
            res.send(JSON.stringify(result));
        else
            res.status(404).send({ error: 'LPair not found' });
    });
})

router.post('/:id',authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['address_id', 'symbol', 'page_url', 'pool_size', 'platform_id', 'icon', 'vault_address_id', 'platform_symbol', 'collateralization_ratio', 'liquidation_ratio', 'risk_rating'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }

    let result = await saveLPair(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    let result = await deleteLPair(req.params.id);
    res.send(JSON.stringify(result));
})

router.get('/:id/apr', async function (req: Request, res: Response) {

    let result = await getAllLPairAPRS(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id/apr/last', async function (req: Request, res: Response) {
    let result = await getlatestLPairAPRS(req.params.id, function (result) {
        if (result)
            res.send(JSON.stringify(result));
        else
            res.send(JSON.stringify({ message: 'No APR value for that LPair' }));        
    });
})

router.post('/:id/apr/', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['apr'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addLPairAPR(req.params.id, req.body);
    res.send(JSON.stringify(result));
})


router.delete('/:id/aprs', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    let result = await deleteAllLPairAPR(req.params.id);
    res.send(JSON.stringify(result));
})

router.get('/:id/param', async function (req: Request, res: Response) {
    let result = await getAllLPairParam(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id/param/last', async function (req: Request, res: Response) {
    let result = await getlatestLPairParam(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/:id/param/', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['max_deposit', 'max_borrow'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addLPairParam(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id/params', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    let result = await deleteAllLPairParam(req.params.id);
    res.send(JSON.stringify(result));
})

router.post('/:id/rewardtoken/:rewardtoken_address', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    let result = await addLPairRewardToken(req.params.id, req.params.rewardtoken_address);
    res.send(JSON.stringify(result));
})

router.delete('/:address_id/rewardtoken/:rewardtoken_address', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    let result = await deleteRewardToken(req.params.address_id,req.params.rewardtoken_address);
    res.send(JSON.stringify(result));
})

module.exports = router