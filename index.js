
const utils = require('./utils');
const portfolioUtils = require('./portfolioUtils');
const ethUtils = require('./ethUtils');
const exchangeUtils = require('./exchangeUtils');
const data = require('./data');

const {
  keys,
  othertokens,
  addresses,
} = data;

const {
  sanitizetokenName,
} = utils;

const {
  combinetokenCounts,
  getTokenValues,
  sumOthertokenCounts,
} = portfolioUtils;

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

// getAllPriceDiff = async tokens => {
//   const start = '26-02-2021'
//   const end = '20-03-2021'
//   await Promise.all(tokens.map(s => getPriceDiff(s, start, end)));

//   console.log(`平均: +${tolDiff / tolCount}%`);
//   getPriceDiff('btc', start, end)
//   getPriceDiff('eth', start, end)
//   getPriceDiff('dot', start, end)
// };

const getAllBalances = async () => {
  let allCountCounts = {};
  const pendings = [];

  /* ----------- exchange tokens ----------- */
  extraFetchers = {
    binance: fetchBinanceContractBalances,
    ftx: fetchFTXContractBalances,
  }

  const {
    all: exchangeTokenCounts,
  } = await getExchangeTokenCounts(keys, extraFetchers);

  pendings.push(
    await getTokenValues('exchange tokens', exchangeTokenCounts)
  );
  allCountCounts = combinetokenCounts(allCountCounts, exchangeTokenCounts);

  /* ----------- other tokens ----------- */
  const othertokenCounts = sumOthertokenCounts(othertokens);
  pendings.push(
    await getTokenValues('other tokens', othertokenCounts)
  );
  allCountCounts = combinetokenCounts(allCountCounts, othertokenCounts);
    
  /* ----------- eth tokens ----------- */
  const ethtokenCounts = await getAllTokensCount(addresses);
  pendings.push(
    await getTokenValues('ETH tokens', ethtokenCounts)
  );
  allCountCounts = combinetokenCounts(allCountCounts, ethtokenCounts);

  /* ----------- all tokens ----------- */
  await Promise.all(pendings);
  await getTokenValues('all tokens', allCountCounts);
};



const main = async () => {
  // getAllPriceDiff(['btc', 'eth', 'ltc']);

  getAllBalances();
};

main();