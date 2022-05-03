import * as express from 'express';
import { Request, Response } from 'express';
import { authorize } from '../middlewares/auth';
import { UserRole, Users, WhitelistMode } from '../models/model';
import { getAllUsers, getUserByPublicKey, addUser, updateUser, deleteUser, getUserNonce } from '../api/users'
import { getAllUserParam, getlatestUserParam, addUserParam, deleteAllUserParam } from '../api/userparam';
import { isNotSafe } from '../utils/utils';
import { getWhiteListMode } from '../utils/config';
import { hasRatioNFT } from '../utils/nft-utils';

let router = express.Router();

router.get('/', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    await getAllUsers(function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/auth/:wallet_address_id', async function (req: Request, res: Response) {
    try{
        const whitelistMode = getWhiteListMode();
        let authorized = false;
        const wallet_address_id = req.params.wallet_address_id;
        const user = await getUserByPublicKey(wallet_address_id);
        switch (whitelistMode) {
            case WhitelistMode.DISABLED:
                authorized = true;
                break;
            case WhitelistMode.ADMIN_ONLY:
                authorized = user !== undefined && user.role === UserRole.ADMIN;
                break;
            case WhitelistMode.REGISTERED_USERS:
                authorized = user !== undefined;
                break;
            case WhitelistMode.REGISTERED_USERS_AND_NFT:
                authorized = user !== undefined || await hasRatioNFT(wallet_address_id);
                break;
        }
        if (authorized && !user){
            await _register(wallet_address_id);
        }
        res.send(authorized);
    }
    catch(error) {
        console.error("There was an error when checking authorization: ", error);
        res.status(500).send({
            error: `There was an error when checking authorization. Contact administrator.`
        })
    }
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

router.post('/', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['wallet_address_id', 'name', 'role'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addUser(req.body);
    res.send(JSON.stringify(result));
})

router.post("/register", async function (req: Request, res: Response) {
  const whitelistModeEnabled = getWhiteListMode() !== WhitelistMode.DISABLED;
  if (whitelistModeEnabled) {
    return res.status(403).send({ error: "Register is currently not allowed" });
  }
  const keylist: string[] = ["wallet_address_id"];
  if (isNotSafe(keylist, req.body)) {
    return res
      .status(400)
      .send({ error: "Request body missing some parameters" });
  }
  let result = await _register(req.body["wallet_address_id"]);
  res.send(JSON.stringify(result));
});

router.put('/:wallet_address_id', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['name', 'role'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await updateUser(req.params.wallet_address_id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:wallet_address_id', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {

    let result = await deleteUser(req.params.wallet_address_id);
    res.send(JSON.stringify(result));
})

router.get('/:wallet_address_id/param', async function (req: Request, res: Response) {
    let result = await getAllUserParam(req.params.wallet_address_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.get('/:wallet_address_id/param/last', async function (req: Request, res: Response) {
    let result = await getlatestUserParam(req.params.wallet_address_id, function (result) {
        res.send(JSON.stringify(result));
    });
})

router.post('/:wallet_address_id/param/', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['max_deposit', 'max_borrow'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }
    let result = await addUserParam(req.params.wallet_address_id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:wallet_address_id/params', authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    let result = await deleteAllUserParam(req.params.wallet_address_id);
    res.send(JSON.stringify(result));
})

async function _register(address: string) {
    const newUser: Users = {
        name: "Automatically registered user",
        role: UserRole.USER,
        wallet_address_id: address
    };
    let result = await addUser(newUser);
    return result;
}

module.exports = router
