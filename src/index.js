const { isEmpty } = require('lodash');
const chalk = require('chalk');

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

const { log } = console;

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
  verbose = true,
} = {}) => {
  verbose && log(chalk.bgGreen(' started to fetch portfolio data ... '));
  verbose && log(chalk.green('(1/5)'), 'fetching exchange token counts ...');
  const {
    all: exchangeTokenCounts,
    ...eachExchanges                         // interestingly, couldn't put an extra ',' here, otherwise rest element won't be the last element anymore
  } = await getExchangeTokenCounts(keys, extraFetchers);

  const _exchangeValues = combineExchanges
    ? [['exchange', exchangeTokenCounts]]
    : Object.entries(eachExchanges);

  verbose && log(chalk.green('(2/5)'), 'fetching ERC20 token counts ...');
  const [ethTokenCounts, ethTokenPrices] = await getAllTokenCounts(addresses);

  verbose && log(chalk.green('(3/5)'), 'fetching other token counts ...');
  const otherTokenCounts = sumOtherTokenCounts(othertokens);

  const allTokenCounts = combineTokenCounts(
    exchangeTokenCounts,
    otherTokenCounts,
    ethTokenCounts,
  );

  const exchangeValues = isEmpty(keys) ? [] : _exchangeValues;
  const ethValues = isEmpty(addresses) ? [] : [['eth', ethTokenCounts]];
  const otherValues = isEmpty(othertokens) ? [] : [['other', otherTokenCounts]];

  verbose && log(chalk.green('(4/5)'), 'fetching all token prices ...');
  const BTCprice = await getBTCPrice();
  let tokenPrices = await getPrices(Object.keys(allTokenCounts), verbose);

  verbose && log(chalk.green('(5/5)'), 'calculating all token values ...');
  tokenPrices = overwritePrices(tokenPrices, ethTokenPrices);
  const allTokenValues = [
    ...exchangeValues,
    ...ethValues,
    ...otherValues,
    ['all', allTokenCounts],
  ].map(([name, counts]) => {
    const values = getTokenValues(counts, tokenPrices, BTCprice);
    return [name, values];
  });

  verbose && log(chalk.bgGreen(' finished!! Let\'s go Bitcoin!! '));

  return Object.fromEntries(allTokenValues);
};

module.exports = {
  getMyPortfolio,
  printPortfolioNicely,
  fetchers,
};
