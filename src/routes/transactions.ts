import express, { Request, Response } from 'express';
import { getDetailTransactions, getVault, getTxStatus, getTxsignatures, addTransaction, addWithdraw, addBorrow, addPayback, addStake, addSwap, addReward } from '../api/transactions'
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

router.post('/:wallet_id/add', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['tx_type', 'signature'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addTransaction(req.params.wallet_id, req.body);
    res.send(JSON.stringify(result));
})

// router.post('/:wallet_id/withdraw', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
//     const keylist: string[] = ['transaction_id', 'address_id', 'amount', 'status', 'slot'];
//     if (isNotSafe(keylist, req.body)) {
//         return res.status(400).send({ error: 'Request body missing some parameters' });
//     }
//     let result = await addWithdraw(req.params.wallet_id, req.body);
//     res.send(JSON.stringify(result));
// })

// router.post('/:wallet_id/borrow', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
//     const keylist: string[] = ['transaction_id', 'address_id', 'amount', 'status', 'slot'];
//     if (isNotSafe(keylist, req.body)) {
//         return res.status(400).send({ error: 'Request body missing some parameters' });
//     }
//     let result = await addBorrow(req.params.wallet_id, req.body);
//     res.send(JSON.stringify(result));
// })

// router.post('/:wallet_id/payback', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
//     const keylist: string[] = ['transaction_id', 'address_id', 'amount', 'status', 'slot'];
//     if (isNotSafe(keylist, req.body)) {
//         return res.status(400).send({ error: 'Request body missing some parameters' });
//     }
//     let result = await addPayback(req.params.wallet_id, req.body);
//     res.send(JSON.stringify(result));
// })

// router.post('/:wallet_id/stake', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
//     const keylist: string[] = ['transaction_id', 'address_id', 'amount', 'status', 'slot'];
//     if (isNotSafe(keylist, req.body)) {
//         return res.status(400).send({ error: 'Request body missing some parameters' });
//     }
//     let result = await addStake(req.params.wallet_id, req.body);
//     res.send(JSON.stringify(result));
// })

// router.post('/:wallet_id/swap', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
//     const swaplist: {}[] = req.body;
//     if (swaplist.length != 2)
//         return res.status(400).send({ error: 'Request body must be a list with two transaction' });

//     const keylist: string[] = ['transaction_id', 'address_id', 'amount', 'conversion_rate', 'status', 'slot'];
//     if (isNotSafe(keylist, swaplist[0])) {
//         return res.status(400).send({ error: 'Request body missing some parameters' });
//     }
//     if (isNotSafe(keylist, swaplist[1])) {
//         return res.status(400).send({ error: 'Request body missing some parameters' });
//     }
//     let result = await addSwap(req.params.wallet_id, req.body);
//     res.send(JSON.stringify(result));
// })

// router.post('/:wallet_id/reward', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
//     const keylist: string[] = ['transaction_id', 'address_id', 'amount', 'base_address_id', 'status', 'slot'];
//     if (isNotSafe(keylist, req.body)) {
//         return res.status(400).send({ error: 'Request body missing some parameters' });
//     }
//     let result = await addReward(req.params.wallet_id, req.body);
//     res.send(JSON.stringify(result));
// })

module.exports = router