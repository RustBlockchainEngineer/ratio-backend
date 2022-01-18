import express from 'express';
import { getAllLPassets, getLPasset, addLPasset, updateLPasset, deleteLPasset } from '../api/lpassets'

let router = express.Router();

router.get('/:lppair_id', async function (req, res) {

    let result = await getAllLPassets(req.params.lppair_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id', async function (req, res) {

    let result = await getLPasset(req.params.id, function (result) {

        res.send(JSON.stringify(result));
    });
})

router.post('/', async function (req, res) {

    let result = await addLPasset(req.body);
    res.send(JSON.stringify(result));
})

router.put('/:id', async function (req, res) {

    let result = await updateLPasset(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', async function (req, res) {

    let result = await deleteLPasset(req.params.id);
    res.send(JSON.stringify(result));
})


module.exports = router