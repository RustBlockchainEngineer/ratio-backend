import express from 'express';
import authMiddleware from './../middlewares/auth';
import Roles from '../constants/Roles';
import { getAllUsers, getUserByPublicKey, addUser, updateUser, deleteUser, getUserNonce } from '../api/users'

let router = express.Router();

router.get('/', authMiddleware.authorize([Roles.Admin]), async function (req, res) {

    let result = await getAllUsers(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:publicKey', async function (req, res) {
    const user = await getUserByPublicKey(req.params.publicKey.toLowerCase());
    if(!user){
      return res.status(404).send({
        error: `User with publicAddress ${req.params.publicKey} is not found in database`
      })
    }
    res.send(JSON.stringify(user));
})

router.get('/nonce/:publicKey', async function (req, res) {
    await getUserNonce(req.params.publicKey.toLowerCase(), function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/', authMiddleware.authorize([Roles.Admin]), async function (req, res) {
    let result = await addUser(req.body);
    res.send(JSON.stringify(result));
})

router.put('/:id', authMiddleware.authorize([Roles.Admin]), async function (req, res) {

    let result = await updateUser(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', authMiddleware.authorize([Roles.Admin]), async function (req, res) {

    let result = await deleteUser(req.params.id);
    res.send(JSON.stringify(result));
})


module.exports = router