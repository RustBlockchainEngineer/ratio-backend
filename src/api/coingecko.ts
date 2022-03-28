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

interface MedianPrice {
  token: string;
  price: number;
}


/**
  * QUERY 1 
  SELECT token from RFDATA.TOKENPRICES;

 *  QUERY 2

 SELECT price
		FROM RFDATA.TOKENPRICES
		WHERE token = 'CASH'
		AND   created_on >= TIMESTAMP('2022-03-28','14:40:00') - INTERVAL 120 MINUTE
		AND   created_on <= CURRENT_TIMESTAMP
		ORDER BY created_on
;

 */
 async function getTokens2(){
  const query = 'SELECT DISTINCT ? from RFDATA.TOKENPRICES';
  const res: Promise<any[]> = dbcon.promise().query(query,['token'])
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

export async function getMedianCoingeckoPrices(callback: (r: MedianPrice[]) => void){
  let ts = Date.now();
  const tokens = await getTokens2();
  let medianPrices: any;
  tokens.map((token)=>{
    let query = 
  })

  // dbcon.query(query,function(err,result){
  //   if (err) {console.log('ERROR'); throw err};
  //   const rows = <RowDataPacket[]>result;
  //   let records: MedianPrice[] = rows.map((row: RowDataPacket) => {
  //       return { "token": row.token, "price": row.price};
  //   });
  //   callback(records);
  // });

}