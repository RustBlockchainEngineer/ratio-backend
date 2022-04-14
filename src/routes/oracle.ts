import * as express from 'express';
import { Request, Response } from 'express';
import { reportPriceToOracle, reportPriceToOracleByLp } from '../api/report-oracle-price';
import { PublicKey } from '@solana/web3.js';

let router = express.Router();

router.get('/pool/:lp_mint_address', async function (req: Request, res: Response) {
    const result = await reportPriceToOracleByLp(new PublicKey(req.params.lp_mint_address));
    // const result = 
    if (!result) {
        return res.status(404).send({
            error: `report oracle prices for ${req.params.lp_mint_address} failed!`
        })
    }
    res.send(JSON.stringify(result));
})

router.get('/:mint_address', async function (req: Request, res: Response) {
    const result = await reportPriceToOracle(new PublicKey(req.params.mint_address));
    // const result = 
    if (!result) {
        return res.status(404).send({
            error: `report oracle price to ${req.params.mint_address} failed!`
        })
    }
    res.send(JSON.stringify(result));
})

module.exports = router