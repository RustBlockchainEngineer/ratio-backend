import express from 'express';
import { getAllLPairs, getLPair, saveLPair, deleteLPair } from '../api/lpairs'
import { getAllLPairAPRS, getlatestLPairAPRS, addLPairAPR, deleteAllLPairAPR } from '../api/lpairapr';
import { getAllLPairParam, getlatestLPairParam, addLPairParam, deleteAllLPairParam } from '../api/lpairparam';
import { isNotSafe } from '../utils/utils';
let router = express.Router();

router.get('/', async function (req, res) {
    let result = await getAllLPairs(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id', async function (req, res) {
    let result = await getLPair(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/:id', async function (req, res) {
    const keylist: string[] = ['address_id', 'symbol', 'page_url', 'pool_size', 'platform_id', 'collateralization_ratio', 'liquidation_ratio', 'risk_rating'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }

    let result = await saveLPair(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', async function (req, res) {

    let result = await deleteLPair(req.params.id);
    res.send(JSON.stringify(result));
})

router.get('/:id/apr', async function (req, res) {

    let result = await getAllLPairAPRS(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id/apr/last', async function (req, res) {
    let result = await getlatestLPairAPRS(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/:id/apr/', async function (req, res) {
    const keylist: string[] = ['apr'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addLPairAPR(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id/aprs', async function (req, res) {
    let result = await deleteAllLPairAPR(req.params.id);
    res.send(JSON.stringify(result));
})

router.get('/:id/param', async function (req, res) {
    let result = await getAllLPairParam(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id/param/last', async function (req, res) {
    let result = await getlatestLPairParam(req.params.id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/:id/param/', async function (req, res) {
    const keylist: string[] = ['max_deposit', 'max_borrow'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addLPairParam(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id/params', async function (req, res) {
    let result = await deleteAllLPairParam(req.params.id);
    res.send(JSON.stringify(result));
})

module.exports = router