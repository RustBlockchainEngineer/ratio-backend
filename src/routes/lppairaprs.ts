import express from 'express';
import { getAllLPpairAPRS, addLPpairAPR, deleteAllLPpairAPR } from '../api/lppairapr'
import authMiddleware from './../middlewares/auth';
import Roles from '../constants/Roles';

let router = express.Router();

router.get('/:lppair_id', async function (req, res) {

    let result = await getAllLPpairAPRS(req.params.lppair_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/', authMiddleware.authorize([Roles.Admin]), async function (req, res) {

    let result = await addLPpairAPR(req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', authMiddleware.authorize([Roles.Admin]), async function (req, res) {

    let result = await deleteAllLPpairAPR(req.params.id);
    res.send(JSON.stringify(result));
})


module.exports = router