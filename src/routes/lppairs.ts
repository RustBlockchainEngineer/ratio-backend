import express from 'express';
import { getAllLPpairs, getLPpair, addLPpair, updateLPpair, deleteLPpair } from '../api/lppairs'

let router = express.Router();

router.get('/:platform_id', async function (req, res) {

    let result = await getAllLPpairs(req.params.platform_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id', async function (req, res) {

    let result = await getLPpair(req.params.id, function (result) {

        res.send(JSON.stringify(result));
    });
})

router.post('/', async function (req, res) {

    let result = await addLPpair(req.body);
    res.send(JSON.stringify(result));
})

router.put('/:id', async function (req, res) {

    let result = await updateLPpair(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', async function (req, res) {

    let result = await deleteLPpair(req.params.id);
    res.send(JSON.stringify(result));
})


module.exports = router