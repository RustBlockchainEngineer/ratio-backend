const CoinGecko = require('coingecko-api');
const axios = require('axios');
const COINGECKO_API = 'https://api.coingecko.com/api/v3/';
const CoinGeckoTokenList = {
    USDC: 'usd-coin',
    UXD: 'uxd-stablecoin',
    USDH: 'usdh',
    USDT: 'tether',
    CASH: 'cashio-dollar',
    UST: 'terrausd-wormhole',
};

const getCoingecko = () => {
  return new CoinGecko();
};

const checkCoingeckoStatus = async (coinGeckoHandler) => {
  const { data } = await getCoingeckoStatus(coinGeckoHandler);
  if (data) {
    return true;
  }
  return false;
};

const getCoingeckoStatus = async (coinGeckoHandler) => {
  try {
    const { data, response, endpoint } = await coinGeckoHandler.getPing();
    // console.log('COINGECKO SERVER ONLINE');
    return { data, response, endpoint };
  } catch (error) {
    console.error(error);
    return {
      data: false,
    };
  }
};

const getCoinGeckoCoinsList = async (coinGeckoHandler) => {
  if (await checkCoingeckoStatus(coinGeckoHandler)) {
    const data = await coinGeckoHandler.getCoinsList();
    return data.data;
  }
};

const getCoinsId = async (coinGeckoHandler) => {
  return await coinGeckoHandler.getCoinsId();
};

//simple/price?ids=bitcoin&vs_currencies=usd
const getCoinGeckoPrice = async (coinId) => {
  try {
    const data = await (await axios.get(`${COINGECKO_API}simple/price?ids=${coinId}&vs_currencies=usd`));
    const usdPrice = data.data[coinId]['usd'];
    return usdPrice;
  } catch (error) {
    return error;
  }
};

const getCoinGeckoPrices = async () => {
  const tokenPrices = {};
  for (const token in CoinGeckoTokenList) {
    tokenPrices[token] = await getCoinGeckoPrice(CoinGeckoTokenList[token]);
  }
  return tokenPrices;
};

module.exports = {
    getCoinGeckoCoinsList,
    getCoinGeckoPrices,
    getCoinGeckoPrice,
};