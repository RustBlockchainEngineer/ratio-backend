import express from 'express';
import { getDetailTransactions, getVault, addDeposit, addWithdraw, addBorrow, addPayback, addStake, addSwap, addReward } from '../api/transactions'
import { isNotSafe } from '../utils/utils';

let router = express.Router();

router.get('/:wallet_id/detail/:address_id', async function (req, res) {

    await getDetailTransactions(req.params.wallet_id, req.params.address_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:wallet_id/vault', async function (req, res) {

    await getVault(req.params.wallet_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/:wallet_id/deposit', async function (req, res) {
    const keylist: string[] = ['transaction_id', 'address_id', 'amount'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addDeposit(req.params.wallet_id, req.body);
    res.send(JSON.stringify(result));
})

router.post('/:wallet_id/withdraw', async function (req, res) {
    const keylist: string[] = ['transaction_id', 'address_id', 'amount'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addWithdraw(req.params.wallet_id, req.body);
    res.send(JSON.stringify(result));
})

router.post('/:wallet_id/borrow', async function (req, res) {
    const keylist: string[] = ['transaction_id', 'address_id', 'amount'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addBorrow(req.params.wallet_id, req.body);
    res.send(JSON.stringify(result));
})

router.post('/:wallet_id/payback', async function (req, res) {
    const keylist: string[] = ['transaction_id', 'address_id', 'amount'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addPayback(req.params.wallet_id, req.body);
    res.send(JSON.stringify(result));
})

router.post('/:wallet_id/stake', async function (req, res) {
    const keylist: string[] = ['transaction_id', 'address_id', 'amount'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addStake(req.params.wallet_id, req.body);
    res.send(JSON.stringify(result));
})

router.post('/:wallet_id/swap', async function (req, res) {
    const swaplist: {}[] = req.body;
    if (swaplist.length != 2)
        return res.status(400).send({ error: 'Request body must be a list with two transaction' });

    const keylist: string[] = ['transaction_id', 'address_id', 'amount', 'conversion_rate'];
    if (isNotSafe(keylist, swaplist[0])) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    if (isNotSafe(keylist, swaplist[1])) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addSwap(req.params.wallet_id, req.body);
    res.send(JSON.stringify(result));
})

router.post('/:wallet_id/reward', async function (req, res) {
    const keylist: string[] = ['transaction_id', 'address_id', 'amount', 'base_address_id'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addReward(req.params.wallet_id, req.body);
    res.send(JSON.stringify(result));
})

module.exports = router