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
const ignoreAbsValueBelow = x => (([key, value]) => Math.abs(value) > x);
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

const calcCoinValues = (coinCounts, prices, ignoreAbsBelow = 100) => {
  const res = {};
  Object.entries(coinCounts).forEach(([name, count]) => {
    const price = prices[sanitizeCoinName(name)];
    res[name] = parseInt(count * price);
  });

  return filterObj(res, ignoreAbsValueBelow(ignoreAbsBelow));
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

const sortByValue = values => Object.entries(values).sort(
  ([_, val1], [__, val2]) => val2 - val1
);

const getCoinValues = async (name, coinCounts, sort = sortByValue) => {
  const prices = await getAllPrices(Object.keys(coinCounts));
  let coinValues = calcCoinValues(coinCounts, prices);

  if (typeof sort === 'function') {
    coinValues = sort(coinValues);
  }

  console.log(`${name} balance:`, coinValues);
};


let tolCount = 0;
let tolDiff = 0;
const getPriceDiff = async (coin, start, end) => {
  symbol2Id = symbol2Id || await getSymbol2Id();
  let symbol = symbol2Id[sanitizeCoinName(coin)];
  coin === 'LIT' && (symbol = 'litentry')

  try {
    const oldData = await CoinGeckoClient.coins.fetchHistory(symbol, {
      date: start,
    });

    const curData = await CoinGeckoClient.coins.fetchHistory(symbol, {
      date: end,
    });

    const oldPrice = oldData.data.market_data.current_price.usd;
    const curPrice = curData.data.market_data.current_price.usd;
    
    const diff = parseInt((curPrice - oldPrice) * 1.0 / oldPrice * 100);
    
    const sign = diff > 0 ? '+' : '';
    console.log(`${coin}: ${sign}${diff}%`);

    tolCount += 1;
    tolDiff += diff;
  } catch (err) {
    console.log('!!!!!!!!!!!!!!!!!!!!!', coin);
    console.log(err);
  }
};

getAllPriceDiff = async coins => {
  const start = '26-02-2021'
  const end = '20-03-2021'
  await Promise.all(coins.map(s => getPriceDiff(s, start, end)));

  console.log(`平均: +${tolDiff / tolCount}%`);
  getPriceDiff('btc', start, end)
  getPriceDiff('eth', start, end)
  getPriceDiff('dot', start, end)
};

const getAllBalances = async extraFetchers => {
  let allCountCounts = {};

  /* ----------- exchange coins ----------- */
  const pendings = Object.entries(keys).map(async ([name, key]) => {
    let exchange = new ccxt[name](key);

    const rawCounts = await exchange.fetchBalance();

    let coinCounts = filterObj(
      rawCounts.total,
      ignoreValueBelow(0),
    );

    const fetcher = extraFetchers[name];   // extra functions to calculate future balances
    if (fetcher) {
      const extraCoinCount = await fetcher(exchange);
      coinCounts = combineCoinCounts(coinCounts, extraCoinCount)
    }

    await getCoinValues(name, coinCounts);
    allCountCounts = combineCoinCounts(allCountCounts, coinCounts);
  });


  /* ----------- other coins ----------- */
  const otherCoinCounts = sumOtherCoinCounts(otherCoins);
  pendings.push(
    await getCoinValues('othercoins', otherCoinCounts)
  );
  allCountCounts = combineCoinCounts(allCountCounts, otherCoinCounts);

  /* ----------- all coins ----------- */
  await Promise.all(pendings);
  await getCoinValues('all coins', allCountCounts);
};

const fetchBinanceContractBalances = async binance => {
  const res = await binance.fetchBalance({ type: 'future' });

  const curPositions = res.info.positions.filter(x => x.positionAmt > 0);
  const coinCount = res.total;      // total balances in future account

  curPositions.forEach(p => {
    const { symbol, positionAmt, notional } = p;
    const coinName = symbol.replace('USDT', '');
    const count = parseInt(positionAmt);

    coinCount[coinName] = coinCount[coinName]
      ? coinCount[coinName] + count
      : count;
    coinCount['USDT'] -= notional;
  });

  return filterObj(
    coinCount,
    ([name, count]) => count !== 0,
  );
};

const main = async () => {
  // getAllPriceDiff(['btc', 'eth', 'ltc']);

  extraFetchers = {
    binance: fetchBinanceContractBalances,
  }
  getAllBalances(extraFetchers);
};

main();