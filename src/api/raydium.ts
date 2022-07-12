import Axios from 'axios';
import { getAccount, getMint } from "@solana/spl-token";
import { medianPriceList } from "./cacheList";
import { PublicKey} from "@solana/web3.js";
import { getConnection,getClusterName,mapClusterToNetworkName } from "../utils/utils";
import BigNumber from 'bignumber.js';
import { dbcon } from '../models/db';
import axios from 'axios';
import { getAllOracleMints } from '../utils/ratio-lending-admin';

export const getAllRaydiumLpTokenPrices = async() => {
    const data = (await axios.get(`https://api.raydium.io/v2/main/pairs`));
    const pairJsonInfo: JsonPairItemInfo[] = data.data;
    const filteredInfo = pairJsonInfo.filter(({ name }) => !name.includes('unknown'));
    const ratioOracleKeys = await getAllOracleMints();

    const poolInfos: any[] = []
    filteredInfo.forEach((raydiumItemInfo)=>{
        if(ratioOracleKeys.includes(raydiumItemInfo.lpMint)){
            // raydium lp token is used in the ratio protocol. so that we can report the raydium lp price
            poolInfos.push({
                poolName: raydiumItemInfo.name,
                lpInfo: {
                    fairPrice: raydiumItemInfo.lpPrice,
                    virtualPrice: raydiumItemInfo.lpPrice,
                    supply: 0,
                },
                tokenASize: 0,
                tokenBSize: 0,
                tokenAPrice:0,
                tokenBPrice:0,
                platform: 'Raydium'
            })
        }
    })
    return poolInfos;
};

export type HexAddress = string
export interface JsonPairItemInfo {
    ammId: HexAddress
    apr24h: number
    apr7d: number
    apr30d: number
    fee7d: number
    fee7dQuote: number
    fee24h: number
    fee24hQuote: number
    fee30d: number
    fee30dQuote: number
    liquidity: number
    lpMint: HexAddress
    lpPrice: number | null // lp price directly. (No need to mandually calculate it from liquidity list)
    market: HexAddress
    name: string
    official: boolean
    price: number // swap price forwrard. for example, if pairId is 'ETH-USDC', price is xxx USDC/ETH
    tokenAmountCoin: number
    tokenAmountLp: number
    tokenAmountPc: number
    volume7d: number
    volume7dQuote: number
    volume24h: number
    volume24hQuote: number
    volume30d: number
    volume30dQuote: number
  }
  