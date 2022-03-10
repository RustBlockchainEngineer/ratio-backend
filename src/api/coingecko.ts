import axios from 'axios';

import { dbcon } from "../models/db";
const COINGECKO_API = 'https://api.coingecko.com/api/v3/';

const CoinGeckoTokenList:{ [key: string]: string; } = {
    "USDC": 'usd-coin',
    "UXD": 'uxd-stablecoin',
    "USDH": 'usdh',
    "USDT": 'tether',
    "CASH": 'cashio-dollar',
    "UST": 'terrausd-wormhole',
};


export async function  getCoinGeckoPrice(coinId:string){
  try {
    const data = await (await axios.get(`${COINGECKO_API}simple/price?ids=${coinId}&vs_currencies=usd`));
    const usdPrice = data.data[coinId]['usd'];
    return usdPrice;
  } catch (error) {
    return error;
  }
};

export async function getCoinGeckoPrices(){
  const tokenPrices:{ [key: string]: string; } = {};
  for (const token in CoinGeckoTokenList) {
    tokenPrices[token] = await getCoinGeckoPrice(CoinGeckoTokenList[token]);
  }
  return tokenPrices;
};

async function saveCoinGeckoPrices(){
  let ts = Date.now();
  const tokenPrices = await getCoinGeckoPrices();

  for (const token in CoinGeckoTokenList) {
    tokenPrices[token] = await getCoinGeckoPrice(CoinGeckoTokenList[token]);
  }
  for (const t of Object.keys(tokenPrices)){
    dbcon.query(`INSERT INTO RFDATA.TOKENPRICES(
      token,
      price,
      created_on,
      source)
      VALUES (?,?,FROM_UNIXTIME(? * 0.001),?)`,
      [t,tokenPrices[t],ts,"coingecko"]
      );
  }
};

export function geckoPricesService(interval:number){
  setInterval(saveCoinGeckoPrices,interval * 60 * 1000)
}