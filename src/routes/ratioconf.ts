import express, { Request, Response } from 'express';
import { getParamValues, getlatestParamValue, addParamsValue, getParamValue, addParamValue, resetParams, addGrrParamValue, resetGrrParams, getlatestGrrParamValue, getGrrParamList } from '../api/ratioconfig'
import { COLLATERALRATIO, MAXRISKRATING, GLABALPARAMS, TRANSACTIONFEE, UserRole } from '../models/model'
import { isNotSafe } from '../utils/utils';
import { authorize } from '../middlewares/auth';
let router = express.Router();

router.get('/collateralratio/:param_name', async function (req, res) {

    await getParamValues(req.params.param_name, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/collateralratio', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

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

router.delete('/collateralratio', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    let result = await resetParams(COLLATERALRATIO);
    res.send(JSON.stringify(result));
})


router.get('/maxriskrating/:param_name', async function (req, res) {

    await getParamValues(req.params.param_name, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/maxriskrating', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    if (isNotSafe(MAXRISKRATING, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }

    let result = await addParamsValue(req.body);
    res.send(JSON.stringify(result));
})

router.get('/maxriskrating/list', async function (req, res) {
    res.send(JSON.stringify(MAXRISKRATING));
})

router.get('/maxriskrating/last', async function (req, res) {

    await getlatestParamValue(MAXRISKRATING, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.delete('/maxriskrating', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    let result = await resetParams(MAXRISKRATING);
    res.send(JSON.stringify(result));
})


router.get('/grr', async function (req, res) {

    await getlatestGrrParamValue(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/grr', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
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

router.delete('/grr', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    let result = await resetGrrParams();
    res.send(JSON.stringify(result));
})

router.get('/general/:param_name', async function (req, res) {

    await getParamValues(req.params.param_name, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/general', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    if (isNotSafe(GLABALPARAMS, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addParamsValue(req.body);
    res.send(JSON.stringify(result));
})

router.post('/general/:param_name', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    if (!GLABALPARAMS.includes(req.params.param_name)) {
        return res.status(400).send({ error: 'Unrecognized parameter name' });
    }
    if (!('param_value' in req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addParamValue(req.params.param_name, req.body);
    res.send(JSON.stringify(result));
})


router.get('/general/list', async function (req, res) {
    res.send(JSON.stringify(GLABALPARAMS));
})

router.get('/general/last', async function (req, res) {

    await getlatestParamValue(GLABALPARAMS, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/general/:param_name/last', async function (req, res) {

    await getParamValue(req.params.param_name, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.delete('/general', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    let result = await resetParams(GLABALPARAMS);
    res.send(JSON.stringify(result));
})

router.get('/transfees/:param_name', async function (req, res) {

    await getParamValues(req.params.param_name, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/transfees', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
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

router.delete('/transfees', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    let result = await resetParams(TRANSACTIONFEE);
    res.send(JSON.stringify(result));
})


module.exports = router