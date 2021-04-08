const { memoize } = require('lodash');
const coingecko = require('coingecko-api');
const chalk = require('chalk');

const utils = require('./utils');

const {
  sanitizetokenName,
} = utils;

const { log } = console;

const coingeckoClient = new coingecko();

const getMarketcapRanks = async duplicateSymbolIds => {
  try {
    const res = await coingeckoClient.coins.markets({
      vs_currency: 'usd',
      ids: duplicateSymbolIds.join(','),
      order: 'market_cap_desc',
    });

    // sorted by market cap, so index is rank
    const ranks = {};
    res.data.forEach(({ id }, rank) => {
      ranks[id] = rank;
    });

    return ranks;
  } catch (err) {
    log('something went wrong when getting marketcaps...');
    log(err);
  }
};

const filterMaxMarketcapId = (symbol2IdMap, marketcapRanks) => Object.fromEntries(
  Object.entries(symbol2IdMap).map(([symbol, ids]) => {
    let maxMCId = ids[0];
    let maxMCRank = marketcapRanks[maxMCId];

    ids.slice(1).forEach(id => {
      const curMCRank = marketcapRanks[id];
      if (curMCRank < maxMCRank) {
        maxMCRank = curMCRank;
        maxMCId = id;
      }
    });

    return [symbol, maxMCId];
  }),
);

const getSymbol2Id = async symbols => {
  const usefulSymbols = new Set(symbols.map(s => sanitizetokenName(s)));
  const res = await coingeckoClient.coins.list();

  const symbol2IdMap = res.data.reduce((memo, cur) => {
    if (usefulSymbols.has(cur.symbol)) {
      const { id, symbol } = cur;
      if (!memo[symbol]) {
        memo[symbol] = [];
      }
      memo[symbol].push(id);
    }

    return memo;
  }, {});

  const duplicateSymbolIds = Object.values(symbol2IdMap).reduce((allIds, curIds) => {
    if (curIds.length > 1) {
      allIds.push(...curIds);
    }

    return allIds;
  }, []);
  const marketcapRanks = await getMarketcapRanks(duplicateSymbolIds);

  return filterMaxMarketcapId(symbol2IdMap, marketcapRanks);
};

const _getPrices = async (params = {}) => {
  const {
    vs_currency = 'usd',
    ids = '',
  } = params;
  const res = await coingeckoClient.coins.markets({ vs_currency, ids });

  return res.data.reduce((memo, cur) => {
    const {
      symbol, current_price: price,
    } = cur;

    return {
      ...memo,
      [symbol]: price,
    };
  }, {});
};

const getPrices = async (symbols, verbose = true) => {
  const symbol2Id = await getSymbol2Id(symbols);
  const ids = [];
  const notSupported = {};

  symbols.forEach(c => {
    const id = symbol2Id[sanitizetokenName(c)];
    if (id) {
      ids.push(id);
    } else {
      verbose && log(
        chalk.yellow('ignored token'),
        chalk.bgYellow(` ${c} `),
        chalk.yellow(': can\'t find it\'s coingecko id...'),
      );
      notSupported[c] = 0;
    }
  });

  const prices = await _getPrices({ ids: ids.join(',') });
  return {
    ...prices,
    ...notSupported,
  };
};

const _getBTCPrice = async () => {
  const res = await coingeckoClient.coins.markets({
    vs_currency: 'usd',
    ids: 'bitcoin',
  });
  return res.data[0].current_price;
};
const getBTCPrice = memoize(_getBTCPrice);

// let tolCount = 0;
// let tolDiff = 0;
// const getPriceDiff = async (token, start, end) => {
//   symbol2Id = symbol2Id || await getSymbol2Id();
//   let symbol = symbol2Id[sanitizetokenName(token)];
//   token === 'LIT' && (symbol = 'litentry')

//   try {
//     const oldData = await coingeckoClient.coins.fetchHistory(symbol, {
//       date: start,
//     });

//     const curData = await coingeckoClient.coins.fetchHistory(symbol, {
//       date: end,
//     });

//     const oldPrice = oldData.data.market_data.current_price.usd;
//     const curPrice = curData.data.market_data.current_price.usd;

//     const diff = parseInt((curPrice - oldPrice) * 1.0 / oldPrice * 100);

//     const sign = diff > 0 ? '+' : '';
//     console.log(`${token}: ${sign}${diff}%`);

//     tolCount += 1;
//     tolDiff += diff;
//   } catch (err) {
//     console.log('!!!!!!!!!!!!!!!!!!!!!', token);
//     console.log(err);
//   }
// };

module.exports = {
  getPrices,
  getBTCPrice,
  // getPriceDiff,
};
