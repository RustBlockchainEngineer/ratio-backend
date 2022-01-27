import express from 'express';
import { getAllTokens, getToken, addToken, addNewPriceToken, getLatestTokenPrice, updateToken, deleteToken } from '../api/tokens'
import { isNotSafe } from '../utils/utils';

let router = express.Router();

router.get('/', async function (req, res) {

    await getAllTokens(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id', async function (req, res) {
    await getToken(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})
router.get('/:id/price', async function (req, res) {
    await getLatestTokenPrice(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/', async function (req, res) {
    const keylist: string[] = ['address_id', 'symbol', 'icon'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }

    let result = await addToken(req.body);
    res.send(JSON.stringify(result));
})

router.post('/:id/price', async function (req, res) {
    const keylist: string[] = ['price', 'confidence'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addNewPriceToken(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.put('/:id', async function (req, res) {
    const keylist: string[] = ['symbol', 'icon'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await updateToken(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', async function (req, res) {

    let result = await deleteToken(req.params.id);
    res.send(JSON.stringify(result));
})

module.exports = router