const marketUtils = require('./marketUtils');
const {
  getAllPrices,
  // getPriceDiff,
} = marketUtils;

const combineCoinCounts = (x, y) => {
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
@param {*} coinCounts 
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
const calcCoinValues = (coinCounts, prices, ignoreAbsBelow = 100) => {
  let res = {};
  Object.entries(coinCounts).forEach(([name, count]) => {
    const tokenData = { count };
    const price = prices[sanitizeCoinName(name)];
    const value = parseInt(count * price);

    if (Math.abs(value) >= ignoreAbsBelow) {
      tokenData['USD'] = parseInt(count * price);
      res[name] = tokenData;
    }
  });

  res.TOTAL = getTotalTokenValues(res);

  return res;
};

const combineFiat = coinCounts => {
  const fiats = new Set([
    'USDT',
    'USD',
    'DAI',
    // 'USDC',
  ]);
  const fiatName = 'USDT';

  const res = { [fiatName]: 0 };
  Object.entries(coinCounts).forEach(([coin, count]) => {
    if (fiats.has(coin)) {
      res[fiatName] += count;
    } else {
      res[coin] = count;
    }
  });

  return res;
};

const getCoinValues = async (name, _coinCounts, sort = sortByValue, transform = combineFiat) => {
  let coinCounts = _coinCounts;
  if (typeof transform === 'function') {
    coinCounts = transform(coinCounts);
  }

  const prices = await getAllPrices(Object.keys(coinCounts));
  let coinValues = calcCoinValues(coinCounts, prices);

  if (typeof sort === 'function') {
    coinValues = sort(coinValues);
  }

  console.log(`${name} balance:`, coinValues);
  return coinValues;
};

const sortByValue = values => Object.entries(values).sort(
  ([_1, { USD: val1 }], [_2, { USD: val2 }]) => val2 - val1
);

const sanitizeCoinName = c => c.toLowerCase();      // TODO: duplicate

const filterObj = (obj, func) => Object.fromEntries(
  Object.entries(obj).filter(func)
);
const ignoreValueBelow = x => (([key, value]) => value > x);
const ignoreAbsValueBelow = x => (([key, value]) => Math.abs(value) > x);
const sumArray = arr => arr.reduce((s, x) => s + x, 0);

const sumOtherCoinCounts = coins => {
  const res = {};
  Object.entries(coins).forEach(([name, counts]) => {
    res[name] = sumArray(counts)
  });

  return res;
}

module.exports = {
  combineCoinCounts,
  sanitizeCoinName,
  getCoinValues,
  filterObj,
  sumOtherCoinCounts,
  ignoreValueBelow,
  sortByValue,
}