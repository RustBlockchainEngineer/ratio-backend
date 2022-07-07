import Axios from 'axios';
import { getAccount, getMint, MintLayout } from "@solana/spl-token";
import { Connection, PublicKey} from "@solana/web3.js";
import { getConnection, getClusterName, mapClusterToNetworkName } from "../utils/utils";
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { getMedianCoingeckoPrices } from './coingecko';

export const SwimUSD_HEXAPOOL_LP_ADDR = "BJUH9GJLaMSLV1E7B3SQLCy9eCfyr6zsrwGcpS2MkqR1";
const SwimUSD_POOL_ADDR = "AfhhYsLMXXyDxQ1B7tNqLTXXDHYtDxCzPcnXWXzHAvDb";

const SWIM_POOL_TOKEN_ACCOUNTS = {
  'USDT': "Hv7yPYnGs6fpN3o1NZvkima9mKDrRDJtNxf23oKLCjau",
  'USDTbs': "9KMH3p8cUocvQRbJfKRAStKG52xCCWNmEPsJm5gc8fzw",
  'USDTet': "2DMUL42YEb4g1HAKXhUxL3Yjfgoj4VvRqKwheorfFcPV",
  'USDC': "5uBU2zUG8xTLA6XwwcTFWib1p7EjCBzWbiy44eVASTfV",
  'USDCet': "4R6b4aibi46JzAnuA8ZWXrHAsR1oZBTZ8dqkuer3LsbS",
  'BUSD': "DukQAFyxR41nbbq2FBUDMyrtF2CRmWBREjZaTVj4u9As"
};

export const getSwimUsdPrice = async () => {
  const connection = new Connection("https://api.metaplex.solana.com");//getConnection();
  let totalPoolPrice = 0;

  const medianPrices = await getMedianCoingeckoPrices();
  await Promise.all(_.map(SWIM_POOL_TOKEN_ACCOUNTS, async (accAddress, tokenName) => {
    let tokenAmount = (await connection.getTokenAccountBalance(new PublicKey(accAddress))).value.uiAmount;
    if (tokenAmount)
    {
      let totalPrice = tokenAmount * medianPrices[tokenName];
      totalPoolPrice += totalPrice;
    }
  }));

  let lpPrice = 0;
  const data = (await connection.getAccountInfo(new PublicKey(SwimUSD_HEXAPOOL_LP_ADDR)))?.data;
  if (data) {
    const lpMintData = MintLayout.decode(new Uint8Array(data));
    const preciseSupply = (new BigNumber(lpMintData.supply.toString()).div(10 ** lpMintData.decimals)).toNumber();
    lpPrice = totalPoolPrice / preciseSupply;
  }

  console.log("lpPrice =", lpPrice);
  return lpPrice;
}

getSwimUsdPrice();