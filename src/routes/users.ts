import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import authMiddleware from '../middlewares/auth';
import { UserRole } from '../models/model';
import { getAllUsers, getUserByPublicKey, addUser, updateUser, deleteUser, getUserNonce } from '../api/users'
import { isNotSafe } from '../utils/utils';

let router = express.Router();

router.get('/', authMiddleware.authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    await getAllUsers(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:wallet_address_id', async function (req: Request, res: Response) {
    const user = await getUserByPublicKey(req.params.wallet_address_id);
    if (!user) {
        return res.status(404).send({
            error: `User with publicAddress ${req.params.wallet_address_id} is not found in database`
        })
    }
    res.send(JSON.stringify(user));
})

router.get('/nonce/:wallet_address_id', async function (req: Request, res: Response) {
    await getUserNonce(req.params.wallet_address_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/', authMiddleware.authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['wallet_address_id', 'name', 'role'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addUser(req.body);
    res.send(JSON.stringify(result));
})

router.put('/:wallet_address_id', authMiddleware.authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['name', 'role'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await updateUser(req.params.wallet_address_id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:wallet_address_id', authMiddleware.authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    let result = await deleteUser(req.params.wallet_address_id);
    res.send(JSON.stringify(result));
})

module.exports = router