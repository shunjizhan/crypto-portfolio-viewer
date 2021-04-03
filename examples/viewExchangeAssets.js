const {
  getMyPortfolio,
  printPortfolioNicely,
  fetchers,
} = require('../src/index');

const {
  fetchBinanceContractBalances,
  fetchFTXContractBalances,
} = fetchers;

const keys = {
  binance: {
    apiKey: 'xxxxxxxxxx',
    secret: 'yyyyyyyyyy',
  },
  ftx: {
    apiKey: 'aaaaaaaaaa',
    secret: 'bbbbbbbbbb',
  },
  // ......
};

(async () => {
  const portfolio = await getMyPortfolio({
    keys,
    extraFetchers: {
      binance: fetchBinanceContractBalances,
      ftx: fetchFTXContractBalances,
    },
  });
  printPortfolioNicely(portfolio);
})();
