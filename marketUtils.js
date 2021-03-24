const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const sanitizeCoinName = c => c.toLowerCase();      // TODO: duplicate

const getSymbol2Id = async () => {
  const data = await CoinGeckoClient.coins.list();
  return data.data.reduce((memo, cur) => {
    const { id, symbol, name } = cur;
    memo[symbol] = id;

    return memo;
  }, {});
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
      console.warn(`token '${c}' is not supported... fall back it's price to 0`);
      notSupported[c] = 0;
    }
  });

  const prices = await getPrices({ ids: ids.join(',') });
  return {
    ...prices,
    ...notSupported,
  };
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

module.exports = {
  getAllPrices,
  getPriceDiff,   // not in use yet
}