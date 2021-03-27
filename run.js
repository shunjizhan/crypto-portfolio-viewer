const {
  getMyPortfolio,
  printPortfolioNicely,
} = require('./index');
const data = require('./data');

const {
  keys,
  othertokens,
  addresses,
} = data;

(run = async () => {
  // getAllPriceDiff(['btc', 'eth', 'ltc']);

  const allTokenValues = await getMyPortfolio({
    keys,
    othertokens,
    addresses,
    combineExchanges: false,
  });

  printPortfolioNicely(allTokenValues);
})();