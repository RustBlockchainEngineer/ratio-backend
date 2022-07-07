import Axios from 'axios';
import { getAccount, getMint } from "@solana/spl-token";
import { medianPriceList } from "./cacheList";
import { PublicKey} from "@solana/web3.js";
import { getConnection,getClusterName,mapClusterToNetworkName } from "../utils/utils";
import BigNumber from 'bignumber.js';
import { dbcon } from '../models/db';


const fetchSaberPools = async () => {
    const network = mapClusterToNetworkName(getClusterName());
    const poolsData = (await Axios.get(`https://registry.saber.so/data/pools-info.${network}.json`)).data.pools;

    const [registeredPools, fields] = await dbcon.promise().query(`SELECT address_id FROM RFDATA.LPAIRS WHERE platform_symbol = 'Saber'`);

    const saberLPTokens = (registeredPools as any).map((item: { address_id: any; }) => item.address_id);
    return poolsData.filter((pool: { lpToken: { address: any; }; }) => saberLPTokens.includes(pool.lpToken.address));
}

const parsePoolData = (pool:any) => {
    const name = pool?.name;
    const tokenAName = name.split('-')[0];
    const tokenBName = name.split('-')[1];
    const tokenA = pool?.swap?.state?.tokenA?.reserve;
    const tokenACoinGeckoId = pool?.tokens[0]?.extensions?.coingeckoId;
    const tokenB = pool?.swap?.state?.tokenB?.reserve;
    const tokenBCoinGeckoId = pool?.tokens[1]?.extensions?.coingeckoId;
    const poolTokenMint = pool?.swap?.state?.poolTokenMint;
    return{
      name,
      tokenA,
      tokenAName,
      tokenACoinGeckoId,
      tokenBName,
      tokenB,
      tokenBCoinGeckoId,
      poolTokenMint,
      tokenASize: '',
      tokenBSize: ''
    }
}

export const fetchSaberPoolData = async (poolName: string) => {
    const poolsData = await fetchSaberPools();
    const poolData = poolsData.find( (pool:any) => pool?.name == poolName);
    
    if(poolData){
      return parsePoolData(poolData);
    }else{
      return undefined;
    }
}

async function fetchSaberTokens() {
    const poolsData = await fetchSaberPools();

    const swapPools = [];
    for (let i = 0; i < poolsData.length; i++) {
      const name = poolsData[i]?.name;
      const tokenAName = name.split('-')[0];
      const tokenBName = name.split('-')[1];
      const tokenA = poolsData[i]?.swap?.state?.tokenA?.reserve;
      const tokenACoinGeckoId = poolsData[i]?.tokens[0]?.extensions?.coingeckoId;
      const tokenB = poolsData[i]?.swap?.state?.tokenB?.reserve;
      const poolTokenMint = poolsData[i]?.swap?.state?.poolTokenMint;
      const tokenBCoinGeckoId = poolsData[i]?.tokens[1]?.extensions?.coingeckoId;
      swapPools.push({
        name,
        tokenA,
        tokenAName,
        tokenACoinGeckoId,
        tokenBName,
        tokenB,
        poolTokenMint,
        tokenBCoinGeckoId,
      });
    }
    return swapPools;
}

const getPoolsTokenSizes = async(pools:any) => {
  const poolsFormatted = await Promise.all(
    pools.map(async (pool:any) => {
      return await getPoolTokenSizes(pool);
    })
  );
  return poolsFormatted;
}

const getPoolTokenSizes = async(pool:any) => {
  const connection = await getConnection();
  pool.tokenASize = (await getAccount(connection,new PublicKey(pool.tokenA))).amount.toString();
  pool.tokenBSize = (await getAccount(connection,new PublicKey(pool.tokenB))).amount.toString();
  return pool;
}

const getSaberPoolDetail = async (poolInfo: any) => {
  const tokenPrices = medianPriceList;
  let lpSupply, fairPrice, virtualPrice;
  const connection = await getConnection();
  if(tokenPrices[poolInfo.tokenAName] != undefined && tokenPrices[poolInfo.tokenBName]!= undefined){
    const tokenAPrice = new BigNumber(tokenPrices[poolInfo.tokenAName]);
    const tokenBPrice = new BigNumber(tokenPrices[poolInfo.tokenBName]);
    const tokenASize =  new BigNumber(poolInfo.tokenASize);
    const tokenBSize =  new BigNumber(poolInfo.tokenBSize);

    const poolTokenInfo = await getMint(connection, new PublicKey(poolInfo.poolTokenMint));
    lpSupply = new BigNumber(poolTokenInfo.supply.toString());

    const tokenAValue = tokenAPrice.multipliedBy(tokenASize);
    const tokenBValue = tokenBPrice.multipliedBy(tokenBSize);

    fairPrice = tokenAValue.sqrt().multipliedBy(tokenBValue.sqrt()).multipliedBy(2).dividedBy(lpSupply).toNumber();
    virtualPrice = tokenAValue.plus(tokenBValue).dividedBy(lpSupply).toNumber();
  }
  return {
    poolName: poolInfo.name,
    lpInfo: {
      fairPrice,
      virtualPrice,
      supply: lpSupply?.toString(),
    },
    tokenASize: poolInfo.tokenASize,
    tokenBSize: poolInfo.tokenBSize,
    tokenAPrice:tokenPrices[poolInfo.tokenAName],
    tokenBPrice:tokenPrices[poolInfo.tokenBName]
  };
}

export const getSaberLPTokenPriceByPoolName = async (poolName: string) => {
  const pool = await fetchSaberPoolData(poolName);
  if(pool){
    const poolFormatted = await getPoolTokenSizes(pool);
    return getSaberPoolDetail(poolFormatted);
  }
}

export const getAllSaberLpTokenPrices = async() => {
    const pools = await fetchSaberTokens();
    const poolTokenSizes = await getPoolsTokenSizes(pools);

    const lpPrices = await Promise.all(
        poolTokenSizes.map(async (pool:any) => {
          return getSaberPoolDetail(pool);
       })
     );
    return lpPrices;
};