import { getMint } from "@solana/spl-token";
import { PublicKey} from "@solana/web3.js";
import { getConnection } from "../utils/utils";

// @ts-ignore

import axios from 'axios';
import { getAllOracleMints } from '../utils/ratio-lending-admin';
import { OpenOrders } from "@project-serum/serum";
import { struct, seq, publicKey, u128, u64 } from './../utils/marshmallow'
import BigNumber from "bignumber.js";

export const getAllRaydiumLpTokenPrices = async(medianPrices: any) => {
    const raydiumPairs = await axios.get(`https://api.raydium.io/v2/main/pairs`);
    const pairJsonInfo: JsonPairItemInfo[] = raydiumPairs.data;
    const filteredInfo = pairJsonInfo.filter(({ name }) => !name.includes('unknown'));
    const ratioOracleKeys = await getAllOracleMints();

    // get raydium pools
    const initialPoolInfos: any[] = []
    filteredInfo.forEach((raydiumItemInfo)=>{
        if(ratioOracleKeys.includes(raydiumItemInfo.lpMint) && raydiumItemInfo.lpPrice){
            // raydium lp token is used in the ratio protocol. so that we can report the raydium lp price
            // let lpPrice = Math.round(raydiumItemInfo.lpPrice * 10 ** USDR_MINT_DECIMALS) / 10 ** USDR_MINT_DECIMALS
            initialPoolInfos.push({
                ammId: raydiumItemInfo.ammId,
                poolName: raydiumItemInfo.name,
                lpInfo: {
                    fairPrice: 0,
                    virtualPrice: 0,
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
    
    const poolInfos: any[] = []
    for(let i=0; i<initialPoolInfos.length; i++){
        const calculatedPoolInfo = await getRaydiumLpPriceInfo(initialPoolInfos[i], medianPrices)
        if(calculatedPoolInfo){
            poolInfos.push(calculatedPoolInfo);
        }
    }
    return poolInfos;
};
export const getRaydiumLpPriceInfo = async(poolInfo: any, medianPrices: any) => {
    const ammId: string = poolInfo.ammId;
    const name: string = poolInfo.poolName;
    const tokenPrices = medianPrices;
    const tokenAName = name.split('-')[0];
    const tokenBName = name.split('-')[1];
    const tokenAPrice = new BigNumber(tokenPrices[tokenAName]);
    const tokenBPrice = new BigNumber(tokenPrices[tokenBName]);

    const connection = getConnection();
    const accountData = await connection.getAccountInfo(new PublicKey(ammId))
    if(accountData){
        
        const parsedAmmData = AMM_INFO_LAYOUT_STABLE.decode(accountData.data)
        
        const { 
            baseVault,
            quoteVault,
            lpMint,
            openOrders,
            marketProgramId,
            baseNeedTakePnl,
            quoteNeedTakePnl
        } = parsedAmmData

        let coinAmount = toBigNumber((await connection.getTokenAccountBalance(baseVault)).value.amount);
        let pcAmount = toBigNumber((await connection.getTokenAccountBalance(quoteVault)).value.amount);
        
        const mintInfo = await getMint(connection, lpMint);
        const lpSupply = mintInfo.supply;
        
        const ammOpenOrdersData = await connection.getAccountInfo(openOrders)
        const OPEN_ORDERS_LAYOUT = OpenOrders.getLayout(marketProgramId)
        const parsedAmmOpenOrders = OPEN_ORDERS_LAYOUT.decode(ammOpenOrdersData?.data)
        
        const { baseTokenTotal, quoteTokenTotal } = parsedAmmOpenOrders
        
        const tokenASize = toBigNumber(coinAmount).plus(toBigNumber(baseTokenTotal)).minus(toBigNumber(baseNeedTakePnl))
        const tokenBSize = toBigNumber(pcAmount).plus(toBigNumber(quoteTokenTotal)).minus(toBigNumber(quoteNeedTakePnl))

        const tokenAValue = tokenAPrice.multipliedBy(tokenASize);
        const tokenBValue = tokenBPrice.multipliedBy(tokenBSize);
        const fairPrice = tokenAValue.sqrt().multipliedBy(tokenBValue.sqrt()).multipliedBy(new BigNumber(2)).dividedBy(toBigNumber(lpSupply));
        const virtualPrice = tokenAValue.plus(tokenBValue).dividedBy(toBigNumber(lpSupply));

        return {
            ammId: ammId,
            poolName: name,
            lpInfo: {
                fairPrice: fairPrice.toString(),
                virtualPrice: virtualPrice.toString(),
                supply: lpSupply.toString(),
            },
            tokenASize: tokenASize.toString(),
            tokenBSize: tokenBSize.toString(),
            tokenAPrice:tokenAPrice.toString(),
            tokenBPrice:tokenBPrice.toString(),
            platform: 'Raydium'
        }
    }
    return null;
}
export const toBigNumber = (num: any)=>{
    return new BigNumber(num.toString())
}
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
  export const AMM_INFO_LAYOUT_STABLE = struct([
    u64("accountType"),
    u64("status"),
    u64("nonce"),
    u64("maxOrder"),
    u64("depth"),
    u64("baseDecimal"),
    u64("quoteDecimal"),
    u64("state"),
    u64("resetFlag"),
    u64("minSize"),
    u64("volMaxCutRatio"),
    u64("amountWaveRatio"),
    u64("baseLotSize"),
    u64("quoteLotSize"),
    u64("minPriceMultiplier"),
    u64("maxPriceMultiplier"),
    u64("systemDecimalsValue"),
    u64("abortTradeFactor"),
    u64("priceTickMultiplier"),
    u64("priceTick"),
    // Fees
    u64("minSeparateNumerator"),
    u64("minSeparateDenominator"),
    u64("tradeFeeNumerator"),
    u64("tradeFeeDenominator"),
    u64("pnlNumerator"),
    u64("pnlDenominator"),
    u64("swapFeeNumerator"),
    u64("swapFeeDenominator"),
    // OutPutData
    u64("baseNeedTakePnl"),
    u64("quoteNeedTakePnl"),
    u64("quoteTotalPnl"),
    u64("baseTotalPnl"),
    u64("poolOpenTime"),
    u64("punishPcAmount"),
    u64("punishCoinAmount"),
    u64("orderbookToInitTime"),
    u128("swapBaseInAmount"),
    u128("swapQuoteOutAmount"),
    u128("swapQuoteInAmount"),
    u128("swapBaseOutAmount"),
    u64("swapQuote2BaseFee"),
    u64("swapBase2QuoteFee"),
  
    publicKey("baseVault"),
    publicKey("quoteVault"),
    publicKey("baseMint"),
    publicKey("quoteMint"),
    publicKey("lpMint"),
  
    publicKey("modelDataAccount"),
    publicKey("openOrders"),
    publicKey("marketId"),
    publicKey("marketProgramId"),
    publicKey("targetOrders"),
    publicKey("owner"),
    seq(u64(), 64, "padding"),
  ]);
  