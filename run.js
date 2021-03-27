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
  const combineExchanges = false;

  const allTokenValues = await getMyPortfolio({
    keys,
    addresses,
    othertokens,
    combineExchanges,
  });

  printPortfolioNicely(allTokenValues);
})();