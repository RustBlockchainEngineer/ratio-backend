import axios from 'axios';

import { dbcon } from "../models/db";
import { tokenPriceList } from "./cacheList";
import { CoinGeckoTokenList } from "../models/model";
import { getSaberLpTokenPrices } from "./saber";
const COINGECKO_API = 'https://api.coingecko.com/api/v3/';

export async function getSaberPrice(){
  const price = await axios.get(`${COINGECKO_API}simple/price?ids=saber&vs_currencies=usd`);
  return price.data;
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