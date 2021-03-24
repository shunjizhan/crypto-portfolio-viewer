const ccxt = require('ccxt');

const utils = require('./utils');
const data = require('./data');

const {
  keys,
  otherCoins,
  addresses,
} = data;

const {
  combineCoinCounts,
  sanitizeCoinName,
  getCoinValues,
  filterObj,
  sumOtherCoinCounts,
  ignoreValueBelow,
  sortByValue,
} = utils;

getAllPriceDiff = async coins => {
  const start = '26-02-2021'
  const end = '20-03-2021'
  await Promise.all(coins.map(s => getPriceDiff(s, start, end)));

  console.log(`平均: +${tolDiff / tolCount}%`);
  getPriceDiff('btc', start, end)
  getPriceDiff('eth', start, end)
  getPriceDiff('dot', start, end)
};

const getAllBalances = async (extraFetchers) => {
  let allCountCounts = {};

  /* ----------- exchange coins ----------- */
  const pendings = Object.entries(keys).map(async ([name, key]) => {
    const exchange = new ccxt[name](key);

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

const main = async () => {
  // getAllPriceDiff(['btc', 'eth', 'ltc']);

  extraFetchers = {
    binance: fetchBinanceContractBalances,
    ftx: fetchFTXContractBalances,
  }
  getAllBalances(extraFetchers);
};

main();