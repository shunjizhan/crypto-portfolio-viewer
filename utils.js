const CoinGecko = require('coingecko-api');
const ccxt = require('ccxt');

const data = require('./data');

const CoinGeckoClient = new CoinGecko();

const {
  keys,
  otherCoins,
  addresses,
} = data;

const sanitizeCoinName = c => c.toLowerCase();
const filterObj = (obj, func) => Object.fromEntries(
  Object.entries(obj).filter(func)
);
const ignoreValueBelow = x => (([key, value]) => value > x);
const sumArray = arr => arr.reduce((s, x) => s + x, 0);

const sumOtherCoinCounts = coins => {
  const res = {};
  Object.entries(coins).forEach(([name, counts]) => {
    res[name] = sumArray(counts)
  });

  return res;
}

const getPrices = async (params = {}) => {
  const {
    vs_currency = 'usd',
    ids = '',
  } = params;
  let data = await CoinGeckoClient.coins.markets(params);

  return data.data.reduce((memo, cur) => {
    const { id, symbol, name, current_price: price } = cur;
    memo[symbol] = price;

    return memo;
  }, {});
};

const getSymbol2Id = async () => {
  const data = await CoinGeckoClient.coins.list();
  return data.data.reduce((memo, cur) => {
    const { id, symbol, name } = cur;
    memo[symbol] = id;

    return memo;
  }, {});
}

let symbol2Id;
const getAllPrices = async coins => {
  symbol2Id = symbol2Id || await getSymbol2Id();
  const ids = [];
  const notSupported = {};

  coins.forEach(c => {
    const id = symbol2Id[sanitizeCoinName(c)];
    if (id) {
      ids.push(id);
    } else {
      notSupported[c] = 0;
    }

    return id;
  });

  const prices = await getPrices({ ids: ids.join(',') });
  return {
    ...prices,
    ...notSupported,
  };
};

const calcCoinValues = (coinCounts, prices, ignoreBelow = 100) => {
  const res = {};
  Object.entries(coinCounts).forEach(([name, count]) => {
    const price = prices[sanitizeCoinName(name)];
    res[name] = parseInt(count * price);
  });

  return filterObj(res, ignoreValueBelow(ignoreBelow));
};

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

const getCoinValues = async (name, coinCounts) => {
  const prices = await getAllPrices(Object.keys(coinCounts));
  coinValues = calcCoinValues(coinCounts, prices);

  console.log(`${name} balance:`, coinValues);
};

const main = async () => {
  // let allCountCounts = {};

  // exchange coins
  Object.entries(keys).forEach(async ([name, key]) => {
    let exchange = new ccxt[name](key);

    const rawBalances = await exchange.fetchBalance();

    const coinCounts = filterObj(
      rawBalances.total,
      ignoreValueBelow(0),
    );

    await getCoinValues(name, coinCounts);
    // allCountCounts = combineCoinCounts(allCountCounts, coinCounts);
  });

  // outside coins
  const otherCoinCounts = sumOtherCoinCounts(otherCoins);
  await getCoinValues('othercoins', otherCoinCounts)
  // allCountCounts = combineCoinCounts(allCountCounts, coinCounts);

  // all coins
  // await getCoinValues('all coins', allCountCounts)
};

main();