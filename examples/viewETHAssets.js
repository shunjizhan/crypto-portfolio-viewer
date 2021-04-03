const {
  getMyPortfolio,
  printPortfolioNicely,
} = require('../src/index');

const addresses = [
  '0x075c92cd8db45f0f3270d6aa9161cc3402dce8ea',   // some random address found online...
  // ......
];

(async () => {
  const portfolio = await getMyPortfolio({ addresses });
  printPortfolioNicely(portfolio);
})();
