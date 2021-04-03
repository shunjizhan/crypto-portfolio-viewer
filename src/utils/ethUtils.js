const axios = require('axios');

const portfolioUtils = require('./portfolioUtils');

const {
  combineTokenCounts,
} = portfolioUtils;

const BASE_URL = 'https://api.ethplorer.io';

const getTokens = async address => {
  const requestURL = `${BASE_URL}/getAddressInfo/${address}?apiKey=freekey`;
  const response = await axios.get(requestURL);
  const {
    ETH: {
      balance: ETHBalance,
    },
    tokens,
  } = response.data;

  const tokenCounts = {
    ETH: ETHBalance,
  };
  const prices = {};
  tokens.forEach(t => {
    const {
      tokenInfo: {
        symbol,
        decimals,
        price: { rate },
      },
      balance,
    } = t;

    if (symbol) {
      tokenCounts[symbol] = balance / (10 ** decimals);
      prices[symbol] = rate;
    }
  });

  return [tokenCounts, prices];
};

const getAllTokenCounts = async addresses => {
  let allTokenCounts = {};
  let allPrices = {};
  await Promise.all(
    addresses.map(async addr => {
      const [tokenCounts, prices] = await getTokens(addr);
      allTokenCounts = combineTokenCounts(allTokenCounts, tokenCounts);
      allPrices = combineTokenCounts(allPrices, prices);
    }),
  );

  return [allTokenCounts, allPrices];
};

module.exports = {
  getAllTokenCounts,
};
