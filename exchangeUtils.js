const ccxt = require('ccxt');

const utils = require('./utils');
const portfolioUtils = require('./portfolioUtils');

const {
  filterObj,
  ignoreValueBelow,
  sortByValue,
} = utils;

const {
  getTokenValues,
  combinetokenCounts,
} = portfolioUtils;

const fetchBinanceContractBalances = async binance => {
  const res = await binance.fetchBalance({ type: 'future' });

  const curPositions = res.info.positions.filter(x => x.positionAmt > 0);
  const tokenCount = res.total;      // total balances in future account

  curPositions.forEach(p => {
    const {
      symbol,
      positionAmt: _count,
      notional: value,
    } = p;
    const tokenName = symbol.replace('USDT', '');
    const count = parseInt(_count);

    tokenCount[tokenName] = tokenCount[tokenName]
      ? tokenCount[tokenName] + count
      : count;
    tokenCount['USDT'] -= value;
  });

  return filterObj(
    tokenCount,
    ([name, count]) => count !== 0,
  );
};

const fetchFTXContractBalances = async ftx => {
  const res = await ftx.fetchPositions();
  const curPositions = res.filter(x => x.size > 0);

  const tokenCount = { USDT: 0 };
  curPositions.forEach(p => {
    const {
      future,
      size: _count,
      cost: value,
    } = p;
    const tokenName = future.split('-')[0];
    const count = parseInt(_count);

    tokenCount[tokenName] = tokenCount[tokenName]
      ? tokenCount[tokenName] + count
      : count;
    tokenCount['USDT'] -= value;
  });

  return filterObj(
    tokenCount,
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

    let tokenCounts = filterObj(
      rawCounts.total,
      ignoreValueBelow(0),
    );

    const fetcher = extraFetchers[exchangeName];   // extra functions to calculate future/margin balances
    if (fetcher) {
      const extratokenCount = await fetcher(exchange);
      tokenCounts = combinetokenCounts(tokenCounts, extratokenCount)
    }

    await getTokenValues(exchangeName, tokenCounts);

    allTokenCounts = combinetokenCounts(allTokenCounts, tokenCounts);
    res[exchangeName] = tokenCounts;
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