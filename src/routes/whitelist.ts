import express from 'express';
import { getAllWhitelists, getWhitelist, addWhitelist, updateWhitelist, deleteWhitelist } from '../api/whitelist'

let router = express.Router();

router.get('/', async function (req, res) {

    let result = await getAllWhitelists(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id', async function (req, res) {

    let result = await getWhitelist(req.params.id, function (result) {

        res.send(JSON.stringify(result));
    });
})

router.post('/', async function (req, res) {

    let result = await addWhitelist(req.body);
    res.send(JSON.stringify(result));
})

router.put('/:id', async function (req, res) {

    let result = await updateWhitelist(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', async function (req, res) {

    let result = await deleteWhitelist(req.params.id);
    res.send(JSON.stringify(result));
})


module.exports = router