import axios from 'axios';
import { RowDataPacket } from 'mysql2';
import { dbcon } from "../models/db";
import { tokenPriceList } from "./cacheList";
import { Token, TokenIDS, TokenPriceSource } from "../models/model";
import { getSaberLpTokenPrices } from "./saber";
import { getAllTokensInSimple } from './tokens';
import { reportAllPriceOracle } from '../utils/ratio-lending-admin';
const COINGECKO_API = 'https://api.coingecko.com/api/v3/';

export async function saveCoinGeckoPrices(){
  let ts = Date.now();
  const tokens = await getAllTokensInSimple();

  const recentPrices:{[key: string]: number} = {};
  for (const mint in tokens) {
    const geckoSymbol = tokens[mint].token_id;
    const tokenSymbol = tokens[mint].symbol;
    const data = (await axios.get(`${COINGECKO_API}simple/price?ids=${geckoSymbol}&vs_currencies=usd`));
    
    tokenPriceList[tokenSymbol] = (data.data[geckoSymbol]?? {usd: 0})['usd'];
    recentPrices[mint] = tokenPriceList[tokenSymbol];
  }

  // reportAllPriceOracle(recentPrices);

  for (const t of Object.keys(tokenPriceList)){
    await dbcon.promise().query(`INSERT INTO RFDATA.TOKENPRICES(
      token,
      price,
      created_on,
      source)
      VALUES (?,?,FROM_UNIXTIME(? * 0.001),?)`,
      [t,tokenPriceList[t],ts,"coingecko"]
      );
  }

  const saberLPoolList = await getSaberLpTokenPrices()
  for (const pool of saberLPoolList){
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
      [pool["poolName"],pool["lpPrice"],pool["tokenASize"],pool["tokenBSize"],pool["tokenAPrice"],pool["tokenBPrice"],"Saber",ts]
      );
  }

  const medianPrices = await getMedianCoingeckoPrices();
  const reportPrices:{[key: string]: number} = {};
  for (const mint in tokens) {
    const tokenSymbol = tokens[mint].symbol;
    if (medianPrices[tokenSymbol]) {
      reportPrices[mint] = medianPrices[tokenSymbol];
    }
  }
  reportAllPriceOracle(reportPrices);
};

export function geckoPricesService(interval:number){
  setInterval(saveCoinGeckoPrices,interval * 60 * 1000)
}

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