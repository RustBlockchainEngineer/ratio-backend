import express, { Request, Response } from 'express';
import { getDetailTransactions, getVault, getTxStatus, getTxsignatures, addTransaction } from '../api/transactions'
import { UserRole } from '../models/model';
import { isNotSafe } from '../utils/utils';
import { authorize } from '../middlewares/auth';

let router = express.Router();

router.get('/:wallet_id/detail/:address_id', async function (req: Request, res: Response) {

    await getDetailTransactions(req.params.wallet_id, req.params.address_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:wallet_id/vault', async function (req: Request, res: Response) {

    await getVault(req.params.wallet_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:wallet_id/signatures', async function (req: Request, res: Response) {

    let result = await getTxsignatures(req.params.wallet_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:wallet_id/:signature', async function (req: Request, res: Response) {

    let result = await getTxStatus(req.params.wallet_id, req.params.signature, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/:wallet_id/new', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['tx_type', 'signature'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addTransaction(req.params.wallet_id, req.body);
    res.send(JSON.stringify(result));
})

module.exports = router