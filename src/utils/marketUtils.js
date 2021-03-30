const { memoize } = require('lodash');
const coingecko = require('coingecko-api');

const utils = require('./utils');

const {
  sanitizetokenName,
} = utils;

const coingeckoClient = new coingecko();

const _getSymbol2Id = async () => {
  const data = await coingeckoClient.coins.list();
  return data.data.reduce((memo, cur) => {
    const { id, symbol, name } = cur;
    memo[symbol] = id;

    return memo;
  }, {});
};
const getSymbol2Id = memoize(_getSymbol2Id);

const _getPrices = async (params = {}) => {
  const {
    vs_currency = 'usd',
    ids = '',
  } = params;
  const data = await coingeckoClient.coins.markets(params);

  return data.data.reduce((memo, cur) => {
    const {
      id, symbol, name, current_price: price,
    } = cur;
    memo[symbol] = price;

    return memo;
  }, {});
};

const getPrices = async symbols => {
  const symbol2Id = await getSymbol2Id();
  const ids = [];
  const notSupported = {};

  symbols.forEach(c => {
    const id = symbol2Id[sanitizetokenName(c)];
    if (id) {
      ids.push(id);
    } else {
      console.warn(`ignored token '${c}': can't find it's coingecko id...`);
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
  const res = await getPrices(['BTC']);
  return res.btc;
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
