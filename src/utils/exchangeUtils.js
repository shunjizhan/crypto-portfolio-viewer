const ccxt = require('ccxt');
const { isEmpty } = require('lodash');

const utils = require('./utils');
const portfolioUtils = require('./portfolioUtils');

const {
  filterObj,
  ignoreValueBelow,
} = utils;

const {
  combineTokenCounts,
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
    const count = parseInt(_count, 10);

    tokenCount[tokenName] = tokenCount[tokenName]
      ? tokenCount[tokenName] + count
      : count;
    tokenCount.USDT -= value;
  });

  return filterObj(
    tokenCount,
    ([, count]) => count !== 0,
  );
};

const fetchFTXContractBalances = async ftx => {
  const CONTRACT_PREMIUM = 0.08;          // assuming contract has average 8% over price than spot
  const IGNORES = new Set(['EXCH']);      // ignores some contract that's not supported by coingecko

  const res = await ftx.fetchPositions();
  const curPositions = res.filter(x => x.size > 0);

  const tokenCount = {
    USDT: 0,
  };

  curPositions.forEach(p => {
    const {
      future,
      netSize: _count,
      cost: value,
    } = p;

    const [tokenName, type] = future.split('-');
    let count = parseInt(_count, 10);

    if (IGNORES.has(tokenName)) return;

    if (type !== 'PERP') {
      count *= (1 + CONTRACT_PREMIUM);
    }

    tokenCount[tokenName] = tokenCount[tokenName]
      ? tokenCount[tokenName] + count
      : count;
    tokenCount.USDT -= value;
  });

  return filterObj(
    tokenCount,
    ([, count]) => count !== 0,
  );
};

const getExchangeTokenCounts = async (keys, extraFetchers, combineExchanges = false) => {
  if (isEmpty(keys)) return [];

  let allTokenCounts = {};
  const eachTokenCounts = [];
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
      tokenCounts = combineTokenCounts(tokenCounts, extratokenCount);
    }

    allTokenCounts = combineTokenCounts(allTokenCounts, tokenCounts);
    eachTokenCounts.push([exchangeName, tokenCounts]);
  });

  await Promise.all(pendings);

  return combineExchanges
    ? [['exchange', allTokenCounts]]
    : eachTokenCounts;
};

module.exports = {
  getExchangeTokenCounts,
  fetchers: {
    fetchBinanceContractBalances,
    fetchFTXContractBalances,
  },
};
