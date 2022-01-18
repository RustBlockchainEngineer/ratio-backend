import express from 'express';
import { getAllTokens, getToken, addToken, updateToken, deleteToken } from '../api/tokens'

let router = express.Router();

router.get('/', async function (req, res) {

    let result = await getAllTokens(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id', async function (req, res) {

    let result = await getToken(req.params.id, function (result) {

        res.send(JSON.stringify(result));
    });
})

router.post('/', async function (req, res) {

    let result = await addToken(req.body);
    res.send(JSON.stringify(result));
})

router.put('/:id', async function (req, res) {

    let result = await updateToken(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', async function (req, res) {

    let result = await deleteToken(req.params.id);
    res.send(JSON.stringify(result));
})


module.exports = router