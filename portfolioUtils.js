const { sum } = require('lodash');

const utils = require('./utils');
const marketUtils = require('./marketUtils');

const {
  sanitizetokenName,
  sortByValue,
} = utils;

const {
  getPrices,
  getBTCPrice,
} = marketUtils;

const combinetokenCounts = (x, y) => {
  const res = { ...x };
  Object.entries(y).forEach(([name, count]) => {
    if (res[name]) {
      res[name] += count;
    } else {
      res[name] = count;
    }
  });

  return res;
};

const getTotalTokenValues = tokens => {
  const res = {
    count: 0,
    USD: 0,
    BTC: 0,
  }

  Object.values(tokens).forEach(({ BTC, USD }) => {
    res.BTC += BTC;
    res.USD += USD;
  });

  return res;
};

/**
@param {*} tokenCounts 
@param {*} prices 
@param {*} ignoreAbsBelow 
@returns an object containing 'token counts', 'USD values', and 'BTC values' for each token
{
  BTC: {
    count: 1.5,
    USD: 80000,
    BTC: 1.5,
  }, 
  ETH: {
    count: 100,
    USD: 160000,
    BTC: 3,
  },
  ...
}
*/
const calcTokenValues = (tokenCounts, prices, BTCPrice, ignoreAbsBelow = 100) => {
  let res = {};
  Object.entries(tokenCounts).forEach(([name, count]) => {
    const tokenData = { count };
    const price = prices[sanitizetokenName(name)];
    const value = parseInt(count * price);
    const value_BTC = value / BTCPrice;

    if (Math.abs(value) >= ignoreAbsBelow) {
      tokenData['USD'] = parseInt(count * price);
      tokenData['BTC'] = parseFloat(parseFloat(value_BTC).toFixed(2));
      res[name] = tokenData;
    }
  });

  res.TOTAL = getTotalTokenValues(res);

  return res;
};

const combineFiat = (tokenCounts, fiatName = 'USDT') => {
  const fiats = new Set([
    'USDT',
    'USD',
    'DAI',
    // 'USDC',
  ]);

  const res = { [fiatName]: 0 };
  Object.entries(tokenCounts).forEach(([token, count]) => {
    if (fiats.has(token)) {
      res[fiatName] += count;
    } else {
      res[token] = count;
    }
  });

  return res;
};

const getTokenValues = async (name, _tokenCounts, sort = sortByValue, transform = combineFiat) => {
  let tokenCounts = _tokenCounts;
  if (typeof transform === 'function') {
    tokenCounts = transform(tokenCounts);
  }

  const BTCprice = await getBTCPrice();
  const prices = await getPrices(Object.keys(tokenCounts));
  let tokenValues = calcTokenValues(tokenCounts, prices, BTCprice);

  if (typeof sort === 'function') {
    tokenValues = sort(tokenValues);
  }

  console.log(`${name} balance:`, tokenValues);
  return tokenValues;
};

const sumOthertokenCounts = tokens => {
  const res = {};
  Object.entries(tokens).forEach(([name, counts]) => {
    res[name] = sum(counts)
  });

  return res;
}

module.exports = {
  combinetokenCounts,
  getTokenValues,
  sumOthertokenCounts,
}