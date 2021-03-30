const {
  getMyPortfolio,
  printPortfolioNicely,
  fetchers,
} = require('../src/index');
const data = require('./exampleData');

const {
  keys,
  othertokens,
  addresses,
} = data;

const {
  fetchBinanceContractBalances,
  fetchFTXContractBalances,
} = fetchers;

(async () => {
  const combineExchanges = false;
  const extraFetchers = {
    binance: fetchBinanceContractBalances,
    ftx: fetchFTXContractBalances,
  };

  const portfolio = await getMyPortfolio({
    keys,
    addresses,
    othertokens,
    combineExchanges,
    extraFetchers,
  });

  printPortfolioNicely(portfolio);
})();
