const ccxt = require('ccxt');
const utils = require('./utils');

const {
  filterObj,
  getCoinValues,
  ignoreValueBelow,
  sortByValue,
  combineCoinCounts,
} = utils;

const fetchBinanceContractBalances = async binance => {
  const res = await binance.fetchBalance({ type: 'future' });

  const curPositions = res.info.positions.filter(x => x.positionAmt > 0);
  const coinCount = res.total;      // total balances in future account

  curPositions.forEach(p => {
    const {
      symbol,
      positionAmt: _count,
      notional: value,
    } = p;
    const coinName = symbol.replace('USDT', '');
    const count = parseInt(_count);

    coinCount[coinName] = coinCount[coinName]
      ? coinCount[coinName] + count
      : count;
    coinCount['USDT'] -= value;
  });

  return filterObj(
    coinCount,
    ([name, count]) => count !== 0,
  );
};

const fetchFTXContractBalances = async ftx => {
  const res = await ftx.fetchPositions();
  const curPositions = res.filter(x => x.size > 0);

  const coinCount = { USDT: 0 };
  curPositions.forEach(p => {
    const {
      future,
      size: _count,
      cost: value,
    } = p;
    const coinName = future.split('-')[0];
    const count = parseInt(_count);

    coinCount[coinName] = coinCount[coinName]
      ? coinCount[coinName] + count
      : count;
    coinCount['USDT'] -= value;
  });

  return filterObj(
    coinCount,
    ([name, count]) => count !== 0,
  );
}

// TODO: can't get LIT value...
const getExchangeTokenCounts = async (keys, extraFetchers) => {
  const res = {};
  let allTokenCounts = {};

  const pendings = Object.entries(keys).map(async ([exchangeName, key]) => {
    const exchange = new ccxt[exchangeName](key);

    const rawCounts = await exchange.fetchBalance();

    let coinCounts = filterObj(
      rawCounts.total,
      ignoreValueBelow(0),
    );

    const fetcher = extraFetchers[exchangeName];   // extra functions to calculate future/margin balances
    if (fetcher) {
      const extraCoinCount = await fetcher(exchange);
      coinCounts = combineCoinCounts(coinCounts, extraCoinCount)
    }

    await getCoinValues(exchangeName, coinCounts);

    allTokenCounts = combineCoinCounts(allTokenCounts, coinCounts);
    res[exchangeName] = coinCounts;
  });

  await Promise.all(pendings);
  res['all'] = allTokenCounts;

  return res;
};

module.exports = {
  getExchangeTokenCounts,
  fetchers: {
    fetchBinanceContractBalances,
    fetchFTXContractBalances,
  }
};