
const utils = require('./utils');
const ethUtils = require('./ethUtils');
const exchangeUtils = require('./exchangeUtils');
const data = require('./data');

const {
  keys,
  otherCoins,
  addresses,
} = data;

const {
  combineCoinCounts,
  sanitizeCoinName,
  getCoinValues,
  sumOtherCoinCounts,
} = utils;

const {
  getAllTokensCount,
} = ethUtils;

const {
  getExchangeTokenCounts,
  fetchers: {
    fetchBinanceContractBalances,
    fetchFTXContractBalances,
  },
} = exchangeUtils;

getAllPriceDiff = async coins => {
  const start = '26-02-2021'
  const end = '20-03-2021'
  await Promise.all(coins.map(s => getPriceDiff(s, start, end)));

  console.log(`平均: +${tolDiff / tolCount}%`);
  getPriceDiff('btc', start, end)
  getPriceDiff('eth', start, end)
  getPriceDiff('dot', start, end)
};

const getAllBalances = async () => {
  let allCountCounts = {};
  const pendings = [];

  /* ----------- exchange coins ----------- */
  extraFetchers = {
    binance: fetchBinanceContractBalances,
    ftx: fetchFTXContractBalances,
  }

  const {
    all: exchangeTokenCounts,
  } = await getExchangeTokenCounts(keys, extraFetchers);

  pendings.push(
    await getCoinValues('exchange tokens', exchangeTokenCounts)
  );
  allCountCounts = combineCoinCounts(allCountCounts, exchangeTokenCounts);

  /* ----------- other coins ----------- */
  const otherCoinCounts = sumOtherCoinCounts(otherCoins);
  pendings.push(
    await getCoinValues('other coins', otherCoinCounts)
  );
  allCountCounts = combineCoinCounts(allCountCounts, otherCoinCounts);
    
  /* ----------- eth coins ----------- */
  const ethCoinCounts = await getAllTokensCount(addresses);
  pendings.push(
    await getCoinValues('ETH coins', ethCoinCounts)
  );
  allCountCounts = combineCoinCounts(allCountCounts, ethCoinCounts);

  /* ----------- all coins ----------- */
  await Promise.all(pendings);
  await getCoinValues('all coins', allCountCounts);
};



const main = async () => {
  // getAllPriceDiff(['btc', 'eth', 'ltc']);

  getAllBalances();
};

main();