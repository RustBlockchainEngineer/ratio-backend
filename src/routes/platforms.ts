import express from 'express';
import { getAllPlatforms, getPlatform, addPlatform, updatePlatform, deletePlatform } from '../api/platforms'

let router = express.Router();

router.get('/', async function (req, res) {

    let result = await getAllPlatforms(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id', async function (req, res) {

    let result = await getPlatform(req.params.id, function (result) {

        res.send(JSON.stringify(result));
    });
})

router.post('/', async function (req, res) {

    let result = await addPlatform(req.body);
    res.send(JSON.stringify(result));
})

router.put('/:id', async function (req, res) {

    let result = await updatePlatform(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', async function (req, res) {

    let result = await deletePlatform(req.params.id);
    res.send(JSON.stringify(result));
})


module.exports = router