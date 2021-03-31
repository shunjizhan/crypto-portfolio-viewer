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
  tokens.forEach(t => {
    const {
      tokenInfo: {
        symbol,
        decimals,
      },
      balance,
    } = t;

    if (symbol) {
      tokenCounts[symbol] = balance / (10 ** decimals);
    }
  });

  return tokenCounts;
};

const getAllTokenCounts = async addresses => {
  let tokenCounts = {};
  await Promise.all(
    addresses.map(async addr => {
      const tokens = await getTokens(addr);
      tokenCounts = combineTokenCounts(tokenCounts, tokens);
    }),
  );

  return tokenCounts;
};

module.exports = {
  getAllTokenCounts,
};
