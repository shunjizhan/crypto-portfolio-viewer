const {
  getMyPortfolio,
  printPortfolioNicely,
  fetchers,
} = require('./index');
const data = require('./data');

const {
  keys,
  othertokens,
  addresses,
} = data;

const {
  fetchBinanceContractBalances,
  fetchFTXContractBalances,
} = fetchers;

(run = async () => {
  const combineExchanges = false;
  const extraFetchers = {
    binance: fetchBinanceContractBalances,
    ftx: fetchFTXContractBalances,
  }

  const portfolio = await getMyPortfolio({
    keys,
    addresses,
    othertokens,
    combineExchanges,
    extraFetchers,
  });

  printPortfolioNicely(portfolio);
})();