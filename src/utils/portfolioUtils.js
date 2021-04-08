const { sum } = require('lodash');
const { isEmpty } = require('lodash');

const utils = require('./utils');

const {
  sanitizetokenName,
  sortByValue,
  toFixedDecimal2,
} = utils;

const overwritePrices = (x, y) => {
  const res = { ...x };
  Object.entries(y).forEach(([name, price]) => {
    if (price) {
      res[sanitizetokenName(name)] = price;
    }
  });

  return res;
};

const _combineTokenCounts = (x, y) => {
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

const combineTokenCounts = (...counts) => counts.reduce((memo, cur) => _combineTokenCounts(memo, cur), {});

const getTotalTokenValues = tokens => {
  const res = {
    count: 0,
    USD: 0,
    BTC: 0,
    price: 0,
  };

  Object.values(tokens).forEach(({ BTC, USD }) => {
    res.BTC += BTC;
    res.USD += USD;
  });

  res.BTC = toFixedDecimal2(res.BTC);

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
  const res = {};
  Object.entries(tokenCounts).forEach(([name, count]) => {
    const tokenData = { count };
    const price = prices[sanitizetokenName(name)];
    const value = parseInt(count * price);
    const value_BTC = value / BTCPrice;

    if (Math.abs(value) >= ignoreAbsBelow) {
      tokenData.USD = parseInt(count * price);
      tokenData.BTC = toFixedDecimal2(value_BTC);
      tokenData.price = price;
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
      res[token] = toFixedDecimal2(count);
    }
  });

  res[fiatName] = toFixedDecimal2(res[fiatName]);

  return res;
};

const getTokenValues = (_tokenCounts, tokenPrices, BTCprice, sort = sortByValue, transform = combineFiat) => {
  let tokenCounts = _tokenCounts;
  if (typeof transform === 'function') {
    tokenCounts = transform(tokenCounts);
  }

  let tokenValues = calcTokenValues(tokenCounts, tokenPrices, BTCprice);

  if (typeof sort === 'function') {
    tokenValues = sort(tokenValues);
  }

  return tokenValues;
};

const sumOtherTokenCounts = tokens => {
  if (isEmpty(tokens)) return [];

  const res = {};
  Object.entries(tokens).forEach(([name, counts]) => {
    res[name] = sum(counts);
  });

  return [['other', res]];
};

module.exports = {
  overwritePrices,
  combineTokenCounts,
  getTokenValues,
  sumOtherTokenCounts,
};
