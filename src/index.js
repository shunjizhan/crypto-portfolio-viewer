const { isEmpty } = require('lodash');
const utils = require('./utils/utils');
const portfolioUtils = require('./utils/portfolioUtils');
const ethUtils = require('./utils/ethUtils');
const exchangeUtils = require('./utils/exchangeUtils');
const marketUtils = require('./utils/marketUtils');

const {
  printPortfolioNicely,
} = utils;

const {
  getPrices,
  getBTCPrice,
} = marketUtils;

const {
  overwritePrices,
  combineTokenCounts,
  getTokenValues,
  sumOtherTokenCounts,
} = portfolioUtils;

const {
  getAllTokenCounts,
} = ethUtils;

const {
  getExchangeTokenCounts,
  fetchers,
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

const getMyPortfolio = async ({
  keys = {},
  addresses = [],
  othertokens = {},
  combineExchanges = false,
  extraFetchers = {},
} = {}) => {
  const {
    all: exchangeTokenCounts,
    ...eachExchanges                         // interestingly, couldn't put an extra ',' here, otherwise rest element won't be the last element anymore
  } = await getExchangeTokenCounts(keys, extraFetchers);

  const otherTokenCounts = sumOtherTokenCounts(othertokens);
  const [ethTokenCounts, ethTokenPrices] = await getAllTokenCounts(addresses);

  const allTokenCounts = combineTokenCounts(
    exchangeTokenCounts,
    otherTokenCounts,
    ethTokenCounts,
  );

  const _exchangeValues = combineExchanges
    ? [['exchange', exchangeTokenCounts]]
    : Object.entries(eachExchanges);

  const exchangeValues = isEmpty(keys) ? [] : _exchangeValues;
  const ethValues = isEmpty(addresses) ? [] : [['eth', ethTokenCounts]];
  const otherValues = isEmpty(othertokens) ? [] : [['other', otherTokenCounts]];

  const BTCprice = await getBTCPrice();
  let tokenPrices = await getPrices(Object.keys(allTokenCounts));

  tokenPrices = overwritePrices(tokenPrices, ethTokenPrices);

  const allTokenValues = [
    ...exchangeValues,
    ...ethValues,
    ...otherValues,
    ['all', allTokenCounts],
  ].map(async ([name, counts]) => {
    const values = await getTokenValues(counts, tokenPrices, BTCprice);
    return [name, values];
  });

  await Promise.all(allTokenValues);

  const res = {};
  allTokenValues.forEach(async p => {
    const [name, values] = await p;
    res[name] = values;
  });

  return res;
};

module.exports = {
  getMyPortfolio,
  printPortfolioNicely,
  fetchers,
};
