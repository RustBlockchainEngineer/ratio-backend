import express from 'express';
import { getAllUsers, getUser, addUser, updateUser, deleteUser, getUserNonce } from '../api/users'

let router = express.Router();

router.get('/', async function (req, res) {

    let result = await getAllUsers(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:id', async function (req, res) {

    let result = await getUser(req.params.id, function (result) {

        res.send(JSON.stringify(result));
    });
})

router.get('/nonce/:publicKey', async function (req, res) {
    await getUserNonce(req.params.publicKey.toLowerCase(), function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/', async function (req, res) {

    let result = await addUser(req.body);
    res.send(JSON.stringify(result));
})

router.put('/:id', async function (req, res) {

    let result = await updateUser(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', async function (req, res) {

    let result = await deleteUser(req.params.id);
    res.send(JSON.stringify(result));
})


module.exports = router