import { getAccount, getMint } from "@solana/spl-token";
import { medianPriceList } from "./cacheList";
import { PublicKey} from "@solana/web3.js";
import { getConnection,getClusterName,mapClusterToNetworkName } from "../utils/utils";

import { publicKey, u128, u64} from '@project-serum/borsh'
// @ts-ignore
import { nu64, struct, u8, seq } from 'buffer-layout'
import axios from 'axios';
import { getAllOracleMints, USDR_MINT_DECIMALS } from '../utils/ratio-lending-admin';
import { OpenOrders } from "@project-serum/serum";
import { BN } from "@project-serum/anchor";

export const getAllRaydiumLpTokenPrices = async() => {
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
        const calculatedPoolInfo = await getRaydiumLpPriceInfo(initialPoolInfos[i])
        if(calculatedPoolInfo){
            poolInfos.push(calculatedPoolInfo);
        }
    }
    return poolInfos;
};
export const getRaydiumLpPriceInfo = async(poolInfo: any) => {
    const ammId: string = poolInfo.ammId;
    const name: string = poolInfo.poolName;
    const tokenPrices = medianPriceList;
    const tokenAName = name.split('-')[0];
    const tokenBName = name.split('-')[1];
    const tokenAPrice = new BN(tokenPrices[tokenAName]);
    const tokenBPrice = new BN(tokenPrices[tokenBName]);

    const connection = getConnection();
    const accountData = await connection.getAccountInfo(new PublicKey(ammId))
    if(accountData){
        const parsedAmmData = AMM_INFO_LAYOUT_STABLE.decode(accountData.data)
        const { 
            poolCoinTokenAccount, 
            poolPcTokenAccount, 
            lpMintAddress, 
            ammOpenOrders, 
            serumProgramId, 
            needTakePnlCoin, 
            needTakePnlPc,
        } = parsedAmmData

        let coinAmount = (await connection.getTokenAccountBalance(poolCoinTokenAccount)).value.amount;
        let pcAmount = (await connection.getTokenAccountBalance(poolPcTokenAccount)).value.amount;
        
        const mintInfo = await getMint(connection, lpMintAddress);
        const lpSupply = mintInfo.supply;
        
        const ammOpenOrdersData = await connection.getAccountInfo(ammOpenOrders)
        const OPEN_ORDERS_LAYOUT = OpenOrders.getLayout(serumProgramId)
        const parsedAmmOpenOrders = OPEN_ORDERS_LAYOUT.decode(ammOpenOrdersData)
        const { baseTokenTotal, quoteTokenTotal } = parsedAmmOpenOrders

        const tokenASize = toBN(coinAmount).add(toBN(baseTokenTotal)).sub(toBN(needTakePnlCoin))
        const tokenBSize = toBN(pcAmount).add(toBN(quoteTokenTotal)).sub(toBN(needTakePnlPc))

        const tokenAValue = tokenAPrice.mul(tokenASize);
        const tokenBValue = tokenBPrice.mul(tokenBSize);
        const fairPrice = tokenAValue.sqr().mul(tokenBValue.sqr()).mul(new BN(2)).div(toBN(lpSupply)).toNumber();
        const virtualPrice = tokenAValue.add(tokenBValue).div(toBN(lpSupply)).toNumber();

        return {
            ammId: ammId,
            poolName: name,
            lpInfo: {
                fairPrice: fairPrice,
                virtualPrice: virtualPrice,
                supply: lpSupply.toString(),
            },
            tokenASize: tokenASize,
            tokenBSize: tokenBSize,
            tokenAPrice:tokenAPrice,
            tokenBPrice:tokenBPrice,
            platform: 'Raydium'
        }
    }
    return null;
}
export const toBN = (num: any)=>{
    return new BN(num.toString())
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
  u64('accountType'),
  u64('status'),
  u64('nonce'),
  u64('orderNum'),
  u64('depth'),
  u64('coinDecimals'),
  u64('pcDecimals'),
  u64('state'),
  u64('resetFlag'),
  u64('minSize'),
  u64('volMaxCutRatio'),
  u64('amountWaveRatio'),
  u64('coinLotSize'),
  u64('pcLotSize'),
  u64('minPriceMultiplier'),
  u64('maxPriceMultiplier'),
  u64('systemDecimalsValue'),
  u64('abortTradeFactor'),
  u64('priceTickMultiplier'),
  u64('priceTick'),
  // Fees
  u64('minSeparateNumerator'),
  u64('minSeparateDenominator'),
  u64('tradeFeeNumerator'),
  u64('tradeFeeDenominator'),
  u64('pnlNumerator'),
  u64('pnlDenominator'),
  u64('swapFeeNumerator'),
  u64('swapFeeDenominator'),
  // OutPutData
  u64('needTakePnlCoin'),
  u64('needTakePnlPc'),
  u64('totalPnlPc'),
  u64('totalPnlCoin'),
  u64('poolOpenTime'),
  u64('punishPcAmount'),
  u64('punishCoinAmount'),
  u64('orderbookToInitTime'),
  u128('swapCoinInAmount'),
  u128('swapPcOutAmount'),
  u128('swapPcInAmount'),
  u128('swapCoinOutAmount'),
  u64('swapCoin2PcFee'),
  u64('swapPc2CoinFee'),

  publicKey('poolCoinTokenAccount'),
  publicKey('poolPcTokenAccount'),
  publicKey('coinMintAddress'),
  publicKey('pcMintAddress'),
  publicKey('lpMintAddress'),
  publicKey('modelDataAccount'),
  publicKey('ammOpenOrders'),
  publicKey('serumMarket'),
  publicKey('serumProgramId'),
  publicKey('ammTargetOrders'),
  publicKey('ammOwner'),
  seq(u64('padding'), 64, 'padding')
])