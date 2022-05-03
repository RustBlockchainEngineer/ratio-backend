import express, { Request, Response } from 'express';
import { Base64 } from "js-base64";
import axios from "axios";
import { requireEnv } from '../utils/utils';

const router = express.Router();

const genesysClientId = requireEnv("GENESYS_CLIENT_ID");
const genesysClientSecret = requireEnv("GENESYS_CLIENT_SECRET");
const genesysIssuer = requireEnv("GENESYS_ISSUER");

router.post('/get-token', async function (_req: Request, res: Response) {
    try {
        const token = Base64.encode(`${genesysClientId}:${genesysClientSecret}`);
        const { access_token } = (
            await axios.post(
                `${genesysIssuer}/token`,
                "grant_type=client_credentials",
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Basic ${token}`,
                    },
                }
            )
        ).data;
        res.status(200).json({ access_token });
    } catch (err: any) {
        return res.status(400).send({ "message": "An error ocurred", "ExceptionMessage": err?.message })
    }
});

module.exports = router
