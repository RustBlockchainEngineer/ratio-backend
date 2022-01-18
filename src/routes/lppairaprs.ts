import express from 'express';
import { getAllLPpairAPRS, addLPpairAPR, deleteAllLPpairAPR } from '../api/lppairapr'

let router = express.Router();

router.get('/:lppair_id', async function (req, res) {

    let result = await getAllLPpairAPRS(req.params.lppair_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/', async function (req, res) {

    let result = await addLPpairAPR(req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', async function (req, res) {

    let result = await deleteAllLPpairAPR(req.params.id);
    res.send(JSON.stringify(result));
})


module.exports = router