import express, { Request, Response } from 'express';
import { getDetailTransactions, getTxStatus, getTxsignatures, addTransaction } from '../api/transactions'
import { UserRole } from '../models/model';
import { isNotSafe } from '../utils/utils';
import { authorize } from '../middlewares/auth';

let router = express.Router();

router.get('/:wallet_id/detail/:vault_address', async function (req: Request, res: Response) {

    await getDetailTransactions(req.params.wallet_id, req.params.vault_address, function (result) {
        res.send(JSON.stringify(result));
    });
})

// router.get('/:wallet_id/vault', async function (req: Request, res: Response) {

//     await getVault(req.params.wallet_id, function (result) {
//         res.send(JSON.stringify(result));
//     });
// })
//working
router.get('/:wallet_id/signatures', async function (req: Request, res: Response) {

    let result = await getTxsignatures(req.params.wallet_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

// working
router.get('/:wallet_id/:signature', async function (req: Request, res: Response) {

    let result = await getTxStatus(req.params.wallet_id, req.params.signature, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/:wallet_id/new', async function (req: Request, res: Response) {
    const keylist: string[] = ['tx_type', 'signature','address_id','vault_address'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    await addTransaction(req.params.wallet_id, req.body);
    res.send(JSON.stringify({"status":"Scheduled"}));
})

module.exports = router

// Deposit:
// Gm35qsQ9BqnqbuKMSvvjFXvFDgSFGxRer8nN7B9C8ysv
// 2r9Cvkbx6tobftsSebezxZ5vniMS9NU4psvbmrGwg2gJmxdPGoKtE14Zz8nJjebHhAqRApJ9oTcGHNpFu7B7c17U


// Withdraw
// Gm35qsQ9BqnqbuKMSvvjFXvFDgSFGxRer8nN7B9C8ysv
//4d3rLxYioJJkTQ2UvAp3Ry1AV1KMHjgMRBmgQrRFC4Cxc3Sueq6XmFwV9f6Qwp25YgBkekRtE9ARDCdBJzfVUqHk


// Borrow
// Gm35qsQ9BqnqbuKMSvvjFXvFDgSFGxRer8nN7B9C8ysv
// 426nkNc2rq2kPFTLnyAgASk2zb1dJMaVebNaiJxVxk3fWEEcE8cVJtRmvcRWzZmdmbWngpkSwrV17xyLAPWzpAfa
// 3viyryAsmcscVmUcte8UCtkbKjamWj1s8sy6WD4vhrfxUo6LgbADFcwJuTPpJsNw2RenH9xKaL9dUj6tLjuXomrf

// payback
// Gm35qsQ9BqnqbuKMSvvjFXvFDgSFGxRer8nN7B9C8ysv
// 3TsSmjzpsHwkPE79is1aFYnpra6bZuGQkQzQrfwczpk3ekdY8qM3AAWidWGRCtpjJtwrkvwVzZ4YaepXcdcfDyaB


// harvest
// Gm35qsQ9BqnqbuKMSvvjFXvFDgSFGxRer8nN7B9C8ysv
// 33d8sr8ztotWnZSYfXTGnayP9ZNEV5QPsDxfditrd6dydSRwWZMsN3K63XcJTbFJn56rQvbviPsBKcr8MZSRmJtL