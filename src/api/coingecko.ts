import axios from 'axios';
import { RowDataPacket } from 'mysql2';
import { dbcon } from "../models/db";
import { medianPriceList, recentPriceList } from "./cacheList";
import { getAllTokensInSimple } from './tokens';
import { reportAllPriceOracle } from '../utils/ratio-lending-admin';
import { getSwimUsdPrice, SwimUSD_HEXAPOOL_LP_ADDR } from './swim';
import { getAllSaberLpTokenPrices } from './saber';
import { getAllRaydiumLpTokenPrices } from './raydium';
const COINGECKO_API = 'https://api.coingecko.com/api/v3/';

export async function saveCoinGeckoPrices(){
  let ts = Date.now();
  const tokens = await getAllTokensInSimple();

  // const recentOraclePrices:{[key: string]: number} = {};
  for (const mint in tokens) {
    const geckoSymbol = tokens[mint].token_id;
    const tokenSymbol = tokens[mint].symbol;
    const data = (await axios.get(`${COINGECKO_API}simple/price?ids=${geckoSymbol}&vs_currencies=usd`));
    
    recentPriceList[tokenSymbol] = (data.data[geckoSymbol]?? {usd: 0})['usd'];
    // recentOraclePrices[mint] = recentPriceList[tokenSymbol];
  }

  // reportAllPriceOracle(recentOraclePrices);

  for (const t of Object.keys(recentPriceList)){
    await dbcon.promise().query(`INSERT INTO RFDATA.TOKENPRICES(
      token,
      price,
      created_on,
      source)
      VALUES (?,?,FROM_UNIXTIME(? * 0.001),?)`,
      [t,recentPriceList[t],ts,"coingecko"]
      );
  }

  const medianPrices = await getMedianCoingeckoPrices();
  const oraclePrices:{[key: string]: number} = {};
  for (const mint in tokens) {
    const tokenSymbol = tokens[mint].symbol;
    if (medianPrices[tokenSymbol]) {
      medianPriceList[tokenSymbol] = medianPrices[tokenSymbol];
      oraclePrices[mint] = medianPrices[tokenSymbol];
    }
  }

  // for swimUsd oracle
  const swimPoolInfo = await getSwimUsdPrice(medianPrices);
  oraclePrices[SwimUSD_HEXAPOOL_LP_ADDR] = swimPoolInfo.lpInfo.virtualPrice

  const saberLPoolList = await getAllSaberLpTokenPrices()
  const raydiumLPInfoList = await getAllRaydiumLpTokenPrices()
  const poolList = [...saberLPoolList, ...raydiumLPInfoList]
  for (const pool of poolList){
    await dbcon.promise().query(`INSERT INTO RFDATA.SOURCELPPRICES(
      pool_name,
      lp_price,
      tokenasize,
      tokenbsize,
      tokenaprice,
      tokenbprice,
      source,
      created_on
      )
      VALUES (?,?,?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
      [pool["poolName"],pool['lpInfo']["virtualPrice"],pool["tokenASize"],pool["tokenBSize"],pool["tokenAPrice"],pool["tokenBPrice"], pool.platform,ts]
      );
  }

  reportAllPriceOracle(oraclePrices);
};

/**The list is already sorted by the query*/
function getMedianPrice(prices:number[]):number{
  const half: number =  (prices.length / 2) | 0; 
  if(!(half%2)){
    return (prices[half-1] + prices[half]) / 2.0;
  }else{
    return prices[half];
  }
}

export async function getMedianCoingeckoPrices(priceFrequency = +(process.env?.PRICE_SAMPLE_DURATION ?? '120')){
  const tokens = await getAllTokensInSimple();
  let medianPrices: {[k: string]: any} = {};
  await Promise.all(Object.values(tokens).map(async (token : any) =>{

    let query = `SELECT price FROM RFDATA.TOKENPRICES WHERE token = ?
                AND   created_on >= CURRENT_TIMESTAMP - INTERVAL ? MINUTE
                AND   created_on <= CURRENT_TIMESTAMP
                ORDER BY price ASC`;

    const result:Promise<any> = dbcon.promise().query(query,[token.symbol,priceFrequency])
    .then(([rows,fields])=> {
        return rows as any;
    })
    .catch((error)=>{
      console.log(error);
      throw error;
    });

    const lastPrices = await result;
    
    const parsedPrices = lastPrices.map((price:any)=>{
       return parseFloat(price.price);
    });
    medianPrices[token.symbol] = getMedianPrice(parsedPrices);
  }));

  return medianPrices;
}

export function geckoPricesService(interval:number){
  setInterval(saveCoinGeckoPrices,interval * 60 * 1000)
}
