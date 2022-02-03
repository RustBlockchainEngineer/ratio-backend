import express, { Request, Response } from 'express';
import { getAllPlatforms, getPlatform, addPlatform, updatePlatform, deletePlatform } from '../api/platforms'
import { UserRole } from '../models/model';
import { isNotSafe } from '../utils/utils';
import authMiddleware from '../middlewares/auth';

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

router.post('/', authMiddleware.authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['name', 'site', 'icon'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }

    let result = await addPlatform(req.body);
    res.send(JSON.stringify(result));
})

router.put('/:id', authMiddleware.authorize([UserRole.ADMIN]), async function (req: Request, res: Response) {
    const keylist: string[] = ['name', 'site', 'icon'];
    if (isNotSafe(keylist, req.body)) {
        return res.status(400).send({ error: 'Request body missing some parameters' });
    }

    let result = await updatePlatform(req.params.id, req.body);
    res.send(JSON.stringify(result));
})

router.delete('/:id', async function (req, res) {

    let result = await deletePlatform(req.params.id);
    res.send(JSON.stringify(result));
})


module.exports = router