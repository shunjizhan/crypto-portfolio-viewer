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

const calcCoinValues = (coinCounts, prices, ignoreAbsBelow = 100) => {
  const res = {};
  Object.entries(coinCounts).forEach(([name, count]) => {
    const price = prices[sanitizeCoinName(name)];
    res[name] = parseInt(count * price);
  });

  return filterObj(res, ignoreAbsValueBelow(ignoreAbsBelow));
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
  ([_, val1], [__, val2]) => val2 - val1
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