const {
  getMyPortfolio,
  printPortfolioNicely,
} = require('../src/index');

const othertokens = {
  BTC: [8.5],         // in cold wallet
  BNB: [200],         // in BSC
  ETH: [10, 30],      // uni-LP, sushi-LP
  USDT: [
    1000,               // borrowed by Alex
    2000,               // borrowed by Kate
    5000,               // my mining machine's value
  ],
  // ......
};

(async () => {
  const portfolio = await getMyPortfolio({ othertokens });
  printPortfolioNicely(portfolio);
})();
