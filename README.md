# Crypto Portfolio Viwer
View your aggregated cryptocurrency portfolio automagically, no matter where the assets are located:
- exchanges
- ETH wallets
- anywhere else, no problem!

## Install
`yarn add crypto-portfolio-viewer`
or
`npm install crypto-portfolio-viewer`

## Basic Usage
### import 
```ts
const {
  getMyPortfolio,
  printPortfolioNicely,
} = require('./crypto-portfolio-viewer');
```

### view exchange assets
we can easily view all exchanges assets using exchange api keys. Exchange namings please refer to [ccxt](https://github.com/ccxt/ccxt#supported-cryptocurrency-exchange-markets).
```ts
const keys = {                               
  binance: {
    apiKey: "xxxxxxxxxx",
    secret: "yyyyyyyyyy"
  },
  ftx: {
    apiKey: "aaaaaaaaaa",
    secret: "bbbbbbbbbb",
  },
  // ......
};

(async () => {
  const portfolio = await getMyPortfolio({ keys });
  printPortfolioNicely(portfolio);
})();
```
### view ETH & ERC20 assets
we can easily view all ETH and ERC20 tokens using ETH addresses.
```ts
const addresses = [                         
  '0x0000000000000000000000000000000000011111',
  '0x00000000000000000000000000000000000fffff',
  // ......
];

(async () => {
  const portfolio = await getMyPortfolio({ addresses });
  printPortfolioNicely(portfolio);
})();
```
[](#other-assets)
### view any other assets
we can easily view any other assets by hard coding their counts. 
```ts
const othertokens = {                        
  "BTC": [8.5],         // in cold wallet
  "BNB": [200],         // in BSC
  "ETH": [10, 30],      // uni-LP, sushi-LP
  "USDT": [
    1000,               // borrowed by Alex
    2000,               // borrowed by Kate
    5000,               // my mining machine's value
  ],
  // ......
};

(async () => {
  const portfolio = await getMyPortfolio({ othertokens });
  printPortfolioNicely(portfolio);
})();
```

### view ALL assets
> Being able to aggregate all assets is the soul of a portfolio viewer. --Aristotélēs
>
we can easily view **all of our assets across many different places**, by combining the usages above.
```ts
const keys = {                               
  binance: {
    apiKey: "xxxxxxxxxx",
    secret: "yyyyyyyyyy"
  },
  ftx: {
    apiKey: "aaaaaaaaaa",
    secret: "bbbbbbbbbb",
  },
};

const addresses = [                         
  '0x0000000000000000000000000000000000011111',
  '0x00000000000000000000000000000000000fffff',
];

const othertokens = {                        
  "BTC": [8.5],         // in cold wallet
  "BNB": [200],         // in BSC
  "ETH": [10, 30],      // uni-LP, sushi-LP
  "USDT": [
    1000,               // borrowed by Alex
    2000,               // borrowed by Kate
    5000,               // my mining machine's value
  ],
};

(async () => {
  const portfolio = await getMyPortfolio({
    keys,
    addresses,
    othertokens,
  });

  printPortfolioNicely(portfolio);
})();
```

#### example result
```shell
----------------------------------------------------------
₿                    Binance tokens                      ₿
----------------------------------------------------------
[
  [ 'TOTAL', { count: 0, USD_value: 10000, BTC_value: 1 } ],
  [ 'BNB', { count: 300, USD_value: 5000, BTC_value: 0.5 } ],
  [ 'REEF', { count: 100, USD_value: 3000, BTC_value: 0.3 } ],
  [ 'USDT', { count: 2000, USD_value: 2000, BTC_value: 0.2 } ]
]

----------------------------------------------------------
₿                      FTX tokens                        ₿
----------------------------------------------------------
[
  [ 'TOTAL', { count: 0, USD_value: 4500, BTC_value: 0.45 } ],
  [ 'FTT', { count: 120.5, USD_value: 3400, BTC_value: 0.34 } ],
  [ 'ATOM', { count: 100, USD_value: 1000, BTC_value: 0.1 } ],
  [ 'ETH', { count: 0.6, USD_value: 600, BTC_value: 0.06 } ],
  [ 'USDT', { count: -500, USD_value: -500, BTC_value: -0.05 } ]        
  // negative value means borrowed from contract or margin
  // this can be disabled or customized.
]

----------------------------------------------------------
₿                  ETH + ERC20 tokens                    ₿
----------------------------------------------------------
[
  [ 'TOTAL', { count: 0, USD_value: 12000, BTC_value: 1.2 } ],
  [ 'ETH', { count: 5, USD_value: 5000, BTC_value: 0.5 } ],
  [ 'UNI', { count: 2014.06, USD_value: 3000, BTC_value: 0.3 } ],
  [ 'SUSHI', { count: 1534.32, USD_value: 2000, BTC_value: 0.2 } ]
  [ 'USDC', { count: 20000, USD_value: 2000, BTC_value: 0.2 } ],
]

----------------------------------------------------------
₿                     other tokens                       ₿
----------------------------------------------------------
[
  [ 'TOTAL', { count: 0, USD_value: 9500, BTC_value: 0.95 } ],
  [ 'KSM', { count: 688, USD_value: 5000, BTC_value: 0.5 } ],
  [ 'DOT', { count: 1000, USD_value: 3000, BTC_value: 0.3 } ],
  [ 'ATOM', { count: 150, USD_value: 1500, BTC_value: 0.15 } ],
]

----------------------------------------------------------
₿                      all tokens                        ₿
----------------------------------------------------------
[
  [ 'TOTAL', { count: 0, USD_value: 36000, BTC_value: 3.6 } ],
  [ 'ETH', { count: 5.6, USD_value: 5600, BTC_value: 0.56 } ],
  [ 'BNB', { count: 300, USD_value: 5000, BTC_value: 0.5 } ],
  [ 'KSM', { count: 688, USD_value: 5000, BTC_value: 0.5 } ],
  [ 'FTT', { count: 120.5, USD_value: 3400, BTC_value: 0.34 } ],
  [ 'UNI', { count: 2014.06, USD_value: 3000, BTC_value: 0.3 } ],
  [ 'REEF', { count: 100, USD_value: 3000, BTC_value: 0.3 } ],
  [ 'DOT', { count: 1000, USD_value: 3000, BTC_value: 0.3 } ],
  [ 'ATOM', { count: 250, USD_value: 2500, BTC_value: 0.25 } ],
  [ 'SUSHI', { count: 1534.32, USD_value: 2000, BTC_value: 0.2 } ]
  [ 'USDC', { count: 2000, USD_value: 2000, BTC_value: 0.2 } ],
  [ 'USDT', { count: 1500, USD_value: 1500, BTC_value: 0.15 } ],
]
```

## Advanced Usage
### custom printer
> Viewing result nicely is the soul of a portfolio viewer. --Shakespeare

we can easily print the result in your favorite fashion:
```ts
const myFavoritePrinter = portfolio => { ... };

(async () => {
  const portfolio = await getMyPortfolio({
    keys,
    addresses,
    othertokens,
  });

  myFavoritePrinter(portfolio);
})();
```
### combine exchange assets
for the exchange tokens, by default we view each exchange separately:
```shell
----------------------------------------------------------
₿                    Binance tokens                      ₿
----------------------------------------------------------
binance tokens prints here ......

----------------------------------------------------------
₿                      FTX tokens                        ₿
----------------------------------------------------------
FTX tokens prints here ......
```

to simplify our portfolio, we can combine all exchange tokens as a whole
```ts
(async () => {
  const portfolio = await getMyPortfolio({
    keys,
    addresses,
    othertokens,
    combineExchanges = true,
  });

  printPortfolioNicely(portfolio);
})();
```
```shell
----------------------------------------------------------
₿                    exchange tokens                     ₿
----------------------------------------------------------
all exchange tokens combined print here ......
```

## contract/future accounts
For contract/future/margin assets in exchanges, since the `ccxt` library that we rely on doesn't yet provide unified interfaces for these accounts, there is no automatted way to catch them into the exchange result. 

But don't worry, we have 2 different ways to inlcude them into our portfolio:

### 1) hard code
We can hard code these assets in `othertokens`. (from [example](#other-assets) above) 
This is pretty convenient, but we will have to manually update `othertokens` whenever assets change in future accounts.

### 2) custom `fetcher`
We can also provide a custom `fetcher` for each exchange.
This is more flexible and powerful. One huge advantages is being able to include contract positions as assets, which enables us to more precisely calculate portfolio details (which I personally use A LOT!!). 

For example, if we have `1000 USDT collateral`, as well as a contract position of `BTC long (2000 USDT worth)`, then technically our 'real' portfolio should look like
```json
{
  USDT: { USD_value: -1000, ... },    // 1000 (collateral) - 2000 (borrowed)
  BTC:  { USD_value: 2000, ... },
}
```
with method 1 (hard code), on the other hand, our 'fake' portfolio looks like
```json
{
  USDT: { USD_value: 1000, ... },    // 1000 (collateral) 
  BTC:  { USD_value: 0, ... },       // totally ignores contract positions!
}
```

### available fetchers
There are already 2 fetchers that I personally use, feel free to use them directly. 
You can also reference them to write your own, or even better, contribute your custom fetchers : )
```ts
const {
  getMyPortfolio,
  printPortfolioNicely,
  fetchers,
} = require('./crypto-portfolio-viewer');

const {
  fetchBinanceContractBalances,
  fetchFTXContractBalances,
} = fetchers;

(async () => {
  const portfolio = await getMyPortfolio({
    keys,
    addresses,
    othertokens,
    extraFetchers: {
      binance: fetchBinanceContractBalances,
      ftx: fetchFTXContractBalances,,
    },
  });

  printPortfolioNicely(portfolio);
})();
```

## Special Thanks
Really appreciate all the fantastic works by [ccxt](https://github.com/ccxt/ccxt) and [coingecko-api](https://github.com/miscavage/CoinGecko-API).
## UI
coming soon