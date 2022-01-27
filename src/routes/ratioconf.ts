import express from 'express';
import { getAllParamValue, getlatestParamValue, addParamsValue, resetParams, addGrrParamValue, resetGrrParams, getlatestGrrParamValue, getGrrParamList } from '../api/ratioconfig'
import { COLLATERALRATIO, MAXRISKRATING, MAXUSDR, TRANSACTIONFEE } from '../models/model'
import { isNotSafe } from '../utils/utils';
let router = express.Router();

router.get('/collateralratio', async function (req, res) {

    await getAllParamValue(COLLATERALRATIO, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/collateralratio', async function (req, res) {

    if (isNotSafe(COLLATERALRATIO, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }

    let result = await addParamsValue(req.body);
    res.send(JSON.stringify(result));
})

router.get('/collateralratio/list', async function (req, res) {
    res.send(JSON.stringify(COLLATERALRATIO));
})

router.get('/collateralratio/last', async function (req, res) {

    await getlatestParamValue(COLLATERALRATIO, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.delete('/collateralratio', async function (req, res) {

    let result = await resetParams(COLLATERALRATIO);
    res.send(JSON.stringify(result));
})

router.get('/grr', async function (req, res) {

    await getlatestGrrParamValue(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/grr', async function (req, res) {
    let result = await addGrrParamValue(req.body);
    res.send(JSON.stringify(result));
})

router.get('/grr/list', async function (req, res) {
    await getGrrParamList(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/grr/last', async function (req, res) {

    await getlatestGrrParamValue(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.delete('/grr', async function (req, res) {

    let result = await resetGrrParams();
    res.send(JSON.stringify(result));
})


router.get('/max', async function (req, res) {

    await getAllParamValue(MAXUSDR, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/max', async function (req, res) {
    if (isNotSafe(MAXUSDR, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addParamsValue(req.body);
    res.send(JSON.stringify(result));
})

router.get('/max/list', async function (req, res) {
    res.send(JSON.stringify(MAXUSDR));
})

router.get('/max/last', async function (req, res) {

    await getlatestParamValue(MAXUSDR, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.delete('/max', async function (req, res) {

    let result = await resetParams(MAXUSDR);
    res.send(JSON.stringify(result));
})

router.get('/transfees', async function (req, res) {

    await getAllParamValue(TRANSACTIONFEE, function (result) {
        res.send(JSON.stringify(result));
    });
})
router.post('/transfees', async function (req, res) {
    if (isNotSafe(TRANSACTIONFEE, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addParamsValue(req.body);
    res.send(JSON.stringify(result));
})
router.get('/transfees/list', async function (req, res) {
    res.send(JSON.stringify(TRANSACTIONFEE));
})

router.get('/transfees/last', async function (req, res) {

    await getlatestParamValue(TRANSACTIONFEE, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.delete('/transfees', async function (req, res) {

    let result = await resetParams(TRANSACTIONFEE);
    res.send(JSON.stringify(result));
})


module.exports = router