import * as express from 'express';
import { Request, Response } from 'express';
import { reportPriceToOracleByLp } from '../api/report-oracle-price';
import { PublicKey } from '@solana/web3.js';

let router = express.Router();

router.get('/:lp_mint_address', async function (req: Request, res: Response) {
    const result = await reportPriceToOracleByLp(new PublicKey(req.params.lp_mint_address));
    if (!result) {
        return res.status(404).send({
            error: `report oracle prices for ${req.params.lp_mint_address} failed!`
        })
    }
    res.send(JSON.stringify(result));
})

module.exports = router