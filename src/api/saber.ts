import Axios from 'axios';
import {getAccount} from "@solana/spl-token";
import { tokenPriceList } from "./cacheList";
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

const fetchSaberPools = async (network:string) => {
    const poolsData = (await Axios.get(`https://registry.saber.so/data/pools-info.${network}.json`)).data.pools;
    return poolsData;
}

const parsePoolData = (pool:any) => {
    const name = pool?.name;
    const tokenAName = name.split('-')[0];
    const tokenBName = name.split('-')[1];
    const tokenA = pool?.swap?.state?.tokenA?.reserve;
    const tokenACoinGeckoId = pool?.tokens[0]?.extensions?.coingeckoId;
    const tokenB = pool?.swap?.state?.tokenB?.reserve;
    const tokenBCoinGeckoId = pool?.tokens[1]?.extensions?.coingeckoId;
    return{
      name,
      tokenA,
      tokenAName,
      tokenACoinGeckoId,
      tokenBName,
      tokenB,
      tokenBCoinGeckoId,
      tokenASize: '',
      tokenBSize: ''
    }
}

export const fetchSaberPoolData = async (network: string, poolName: string) => {
    const poolsData = await fetchSaberPools(network);
    const poolData = poolsData.find( (pool:any) => pool?.name == poolName);
    if(poolData){
      return parsePoolData(poolData);
    }else{
      return undefined;
    }
}

async function fetchSaberTokens(network: string) {
    const poolsData = await fetchSaberPools(network);
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

const getPoolsTokenSizes = async(pools:any, env:NETWORK) => {
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

export const getPoolTokenSizes = async(pool:any, env:NETWORK) => {
  const connection = await getConnection(env);
  pool.tokenASize = (await getAccount(connection,new PublicKey(pool.tokenA))).amount.toString();
  pool.tokenBSize = (await getAccount(connection,new PublicKey(pool.tokenB))).amount.toString();
  return pool;
}

export const getSaberLpTokenPrice = async (env:NETWORK,poolName: string) => {
  const pool = await fetchSaberPoolData(env,poolName);
  const tokenPrices = tokenPriceList;
  let poolPrice;
  if(pool){
    const poolFormatted = await getPoolTokenSizes(pool,env);
    if(tokenPrices[poolFormatted.tokenAName] != undefined && tokenPrices[poolFormatted.tokenBName]!= undefined){
      //@ts-ignore
      const tokenAPriceSqrt = (new BigNumber(tokenPrices[poolFormatted.tokenAName])).sqrt();
      //@ts-ignore
      const tokenBPriceSqrt = (new BigNumber(tokenPrices[poolFormatted.tokenBName])).sqrt();
      const tokenASizeSqrt =  (new BigNumber(poolFormatted.tokenASize)).sqrt();
      const tokenBSizeSqrt =  (new BigNumber(poolFormatted.tokenBSize)).sqrt();
      const totalReserveTokens = (new BigNumber(poolFormatted.tokenASize)).plus(poolFormatted.tokenBSize);

      poolPrice = ( (tokenAPriceSqrt
                          .multipliedBy(tokenBPriceSqrt)
                          .multipliedBy(tokenASizeSqrt)
                          .multipliedBy(tokenBSizeSqrt)
                        ).multipliedBy(2) ).dividedBy(totalReserveTokens).toString();
    }
    return {
      poolName: poolFormatted.name,
      lpPrice: poolPrice,
      tokenASize: poolFormatted.tokenASize,
      tokenBSize: poolFormatted.tokenBSize,
      tokenAPrice:tokenPrices[poolFormatted.tokenAName],
      tokenBPrice:tokenPrices[poolFormatted.tokenBName]
    };
  }
}
/**
 * 
  2 * (sqrt(a1) * sqrt(a2) * sqrt(r1) * sqrt(r2)) / (r1 + r2),
  where a1, a2 are the prices of the assets and r1, r2 are the amount of each token in the pool
 * 
 */
export const getSaberLpTokenPrices = async(env: NETWORK) => {
    const pools = await fetchSaberTokens(env);
    const tokenPrices = tokenPriceList;
    const poolTokenSizes = await getPoolsTokenSizes(pools,env);
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
           lpPrice: pool.lpPrice,
           tokenASize: pool.tokenASize,
           tokenBSize: pool.tokenBSize,
           tokenAPrice:tokenPrices[pool.tokenAName],
           tokenBPrice:tokenPrices[pool.tokenBName]
         };
       })
     );
    return lpPrices;
};
/**
 * A * sum(x_i) * n**n + D = A * D * n**n + D**(n+1) / (n**n * prod(x_i))
 */
export const getUsdrPrice = async(env: NETWORK) => {
  const poolData = await getSaberLpTokenPrice(env,'USD-USDR');
  return poolData;
};