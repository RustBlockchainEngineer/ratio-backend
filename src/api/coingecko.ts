import axios from 'axios';
import { RowDataPacket } from 'mysql2';
import { dbcon } from "../models/db";
import { tokenPriceList } from "./cacheList";
import { CoinGeckoTokenList } from "../models/model";
import { getSaberLpTokenPrices } from "./saber";
const COINGECKO_API = 'https://api.coingecko.com/api/v3/';

export async function getSaberPrice(){
  const price = await axios.get(`${COINGECKO_API}simple/price?ids=saber&vs_currencies=usd`);
  return price.data.saber.usd;
}

export async function saveCoinGeckoPrices(){
  let ts = Date.now();
  for (const token in CoinGeckoTokenList) {
    const data = (await axios.get(`${COINGECKO_API}simple/price?ids=${CoinGeckoTokenList[token]}&vs_currencies=usd`));
    tokenPriceList[token] = data.data[CoinGeckoTokenList[token]]['usd'];
  }
  const saberLPoolList = await getSaberLpTokenPrices()

  for (const t of Object.keys(tokenPriceList)){
    dbcon.query(`INSERT INTO RFDATA.TOKENPRICES(
      token,
      price,
      created_on,
      source)
      VALUES (?,?,FROM_UNIXTIME(? * 0.001),?)`,
      [t,tokenPriceList[t],ts,"coingecko"]
      );
  }
  for (const pool of saberLPoolList){
    dbcon.query(`INSERT INTO RFDATA.SOURCELPPRICES(
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
};

export function geckoPricesService(interval:number){
  setInterval(saveCoinGeckoPrices,interval * 60 * 1000)
}

async function getTokens(){
  const query = 'SELECT DISTINCT token from RFDATA.TOKENPRICES';
  const res: Promise<any[]> = dbcon.promise().query(query)
  .then(([ rows, fields])=> {
    return rows as any;
  })
  .catch((error)=>{
    console.log(error);
  });
  const tokens = [];
  for (let obj of await res){
    tokens.push(obj.token);
  }
  return tokens;
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

export async function getMedianCoingeckoPrices(){
  const tokens = await getTokens();
  let medianPrices: {[k: string]: any} = {};
  await Promise.all(tokens.map(async (token) =>{

    let query = `SELECT price FROM RFDATA.TOKENPRICES WHERE token = ?
		AND   created_on >= CURRENT_TIMESTAMP - INTERVAL 25 MINUTE
		AND   created_on <= CURRENT_TIMESTAMP
		ORDER BY price ASC`;

    const result:Promise<any> = dbcon.promise().query(query,[token])
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

    medianPrices[token] = getMedianPrice(parsedPrices);
  }));

  return medianPrices;
}