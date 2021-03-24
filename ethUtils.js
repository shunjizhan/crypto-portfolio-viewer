const axios = require('axios');

const utils = require('./utils');

const {
  combineCoinCounts,
} = utils;

const BASE_URL = "https://api.ethplorer.io";

const getTokens = async address => {
  const requestURL = `${BASE_URL}/getAddressInfo/${address}?apiKey=freekey`;
  const response = await axios.get(requestURL)
  const {
    ETH: { balance },
    tokens,
  } = response.data;

  const coinCounts = { ETH: balance };
  tokens.forEach(t => {
    const {
      tokenInfo: {
        symbol,
        decimals,
      },
      balance,
    } = t;

    if (symbol) {
      coinCounts[symbol] = balance / (10 ** decimals);
    }
  });

  return coinCounts;
};

const getAllTokensCount = async addresses => {
  let tokenCounts = {};
  await Promise.all(
    addresses.map(async addr => {
      const tokens = await getTokens(addr);
      tokenCounts = combineCoinCounts(tokenCounts, tokens);
    })
  );

  return tokenCounts;
};

module.exports = {
  getAllTokensCount,
};