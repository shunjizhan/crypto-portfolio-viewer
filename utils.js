const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

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
    const id = symbol2Id[c.toLowerCase()];
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


(async () => {
  let data = await getAllPrices([
    "PCX",
    "FIL",
    "XOR",
    "RING",
    "AR",
    "KLP",
    "EDG",
    "FIS",
    "POLS",
    "HEGIC",
    "API3",
    "KP3R",
    "INJ",
    "MATIC",
    "MIR",
    "ARMOR",
    "ALPHA",
    "BAO",
    "SDT",
    "EWT",
    "PBR",
    "front",
    "BFC",
    "OM",
    "RFUEL",
    "TPT",
    "BMI",
    "ROOM",
    "UMB",
    "SPDR",
    "FCL",
    "POLK",
    "SUPER",
    "DVG",
    "FXF",
    "BFLY",
    "PAID",
    "CVR",
    "DIS",
    "YOP",
    "NORD",
    "TEN",
    "XED",
    "FIRE",
    "Xdef2",
    "ROYA",
    "MAHA",
    "QUICK",
    "KYL",
    "APYS",
    "OCEAN",
    "LIT",
    "REEF",
    "BLZ",
    "CELR",
    "OAX",
    "PNT",
    "ORN",
    "CAKE",
    "BNB",
    "BLANK",
    "BONDLY",
    "BCUG",
    "KONO",
    "ODDZ",
    "ERN",
    "CGG",
  ]);

  console.log(data);
})();