import Axios from 'axios';
import {getAccount} from "@solana/spl-token";
import * as coingeckoOps from '../api/coingecko';
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import BigNumber from 'bignumber.js';

export enum NETWORK {
  MAINNET = "mainnet",
  DEVNET = "devnet"
};

const getConnection = async(env:NETWORK) => {
  if(env == 'mainnet'){
    return new Connection(
      clusterApiUrl('mainnet-beta'),
      'confirmed'
    );
  }else{
    return new Connection(
      clusterApiUrl('devnet'),
      'confirmed'
    );
  }
}

async function fetchSaberTokens(network: string) {
    const poolsData = (await Axios.get(`https://registry.saber.so/data/pools-info.${network}.json`)).data.pools;
    const swapPools = [];
    for (let i = 0; i < poolsData.length; i++) {
      const name = poolsData[i]?.name;
      const tokenAName = name.split('-')[0];
      const tokenBName = name.split('-')[1];
      const tokenA = poolsData[i]?.swap?.state?.tokenA?.reserve;
      const tokenACoinGeckoId = poolsData[i]?.tokens[0]?.extensions?.coingeckoId;
      const tokenB = poolsData[i]?.swap?.state?.tokenB?.reserve;
      const tokenBCoinGeckoId = poolsData[i]?.tokens[1]?.extensions?.coingeckoId;
      swapPools.push({
        name,
        tokenA,
        tokenAName,
        tokenACoinGeckoId,
        tokenBName,
        tokenB,
        tokenBCoinGeckoId,
      });
    }
    return swapPools;
}

const getPoolTokenSizes = async(pools:any, env:NETWORK) => {
  const connection = await getConnection(env);
  const poolsFormatted = await Promise.all(
    pools.map(async (pool:any) => {
      pool.tokenASize = (await getAccount(connection,new PublicKey(pool.tokenA))).amount.toString();
      pool.tokenBSize = (await getAccount(connection,new PublicKey(pool.tokenB))).amount.toString();
      return pool;
    })
  );
  return poolsFormatted;
}

export const getSaberLpTokenPrice = async (env:NETWORK,poolName: string) => {
}
/**
 * 
  2 * (sqrt(a1) * sqrt(a2) * sqrt(r1) * sqrt(r2)) / (r1 + r2),
  where a1, a2 are the prices of the assets and r1, r2 are the amount of each token in the pool
 * 
 */
export const getSaberLpTokenPrices = async(env: NETWORK) => {
    const pools = await fetchSaberTokens(env);
    const tokenPrices = await coingeckoOps.getCoinGeckoPrices();
    const poolTokenSizes = await getPoolTokenSizes(pools,env);

    const lpPrices = await Promise.all(
        poolTokenSizes.map(async (pool:any) => {
          //@ts-ignore
         if(tokenPrices[pool.tokenAName] != undefined && tokenPrices[pool.tokenBName]!= undefined){
           //@ts-ignore
           const tokenAPriceSqrt = (new BigNumber(tokenPrices[pool.tokenAName])).sqrt();
           //@ts-ignore
           const tokenBPriceSqrt = (new BigNumber(tokenPrices[pool.tokenBName])).sqrt();
           const tokenASizeSqrt =  (new BigNumber(pool.tokenASize)).sqrt();
           const tokenBSizeSqrt =  (new BigNumber(pool.tokenBSize)).sqrt();
           const totalReserveTokens = (new BigNumber(pool.tokenASize)).plus(pool.tokenBSize);

           pool.lpPrice = ( (tokenAPriceSqrt
                            .multipliedBy(tokenBPriceSqrt)
                            .multipliedBy(tokenASizeSqrt)
                            .multipliedBy(tokenBSizeSqrt)
                          ).multipliedBy(2) ).dividedBy(totalReserveTokens).toString();
         }
         return {
           poolName: pool.name,
           lpPrice: pool.lpPrice
         };
       })
     );
    return lpPrices;
};

//https://api.coingecko.com/api/v3/simple/price?ids=a&vs_currencies=usd