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

export function getMedianCoingeckoPrices(callback: (r: MedianPrice[]) => void){
  let ts = Date.now();
  const query = `SELECT token,price from RFDATA.TOKENPRICES 
                    WHERE created_on <= ${(ts * 0.001) - (60 * 25)} 
                    order by id desc limit ${Object.keys(CoinGeckoTokenList).length}`;
  dbcon.query(query,function(err,result){
    if (err) {console.log('ERROR'); throw err};
    const rows = <RowDataPacket[]>result;
    let records: MedianPrice[] = rows.map((row: RowDataPacket) => {
        return { "token": row.token, "price": row.price};
    });
    callback(records);
  });
}