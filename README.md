# Crypto Portfolio Viewer
View your **aggregated** cryptocurrency portfolio automagically, no matter where the assets are located:
- ✅ Exchanges
- ✅ ETH wallets
- ✅ Anywhere else, no problem!
- ⭕️ Polkadot parachains (soon)
- ⭕️ BSC & HECO (someday)
  
___
## Foreword
As a crypto trader *~~pro~~*, I have long been struggling with tracking all my tokens in a unified way, since they locate in so many different places: Binance, Huobi, Coinbase, FTX, ETH hot/cold wallets, BTC wallets, BSC, HECO, ICOs, mining machines... 🤯

If you are facing similar issues, this is for you. 🎉

I made this tool for every crypto lover ❤️, like you and I, to manage all assets more conveniently. So we can be more focused on making wise trading decisions. 🥳

___
## Basic Usage
### 🌀 install
```
$ yarn add crypto-portfolio-viewer
$ npm install crypto-portfolio-viewer --save
```
### 🌀 import 
```ts
/* ----- CommonJS ----- */
const {
  getPortfolio,
  printPortfolioNicely,   // optional
} = require('crypto-portfolio-viewer');

/* ----- ES modules ----- */
import {
  getPortfolio,
  printPortfolioNicely,   // optional
} from 'crypto-portfolio-viewer';
```

### 🌀 eth + erc20 assets
we can easily view all ETH and ERC20 tokens using ETH addresses.
```ts
const addresses = [                         
  '0x0000000000000000000000000000000000011111',
  '0x00000000000000000000000000000000000fffff',
  // ......
];

(async () => {
  const portfolio = await getPortfolio({ addresses });
  printPortfolioNicely(portfolio);
})();
```

### 🌀 exchange assets
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
  const portfolio = await getPortfolio({ keys });
  printPortfolioNicely(portfolio);
})();
```
[](#other-assets)
### 🌀 any other assets
we can easily view any other assets by hard coding their counts. 
```ts
const othertokens = {                        
  "BTC": [8.5],         // in mysterious wallet
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
  const portfolio = await getPortfolio({ othertokens });
  printPortfolioNicely(portfolio);
})();
```

### 🌀 ALL assets
> Being able to aggregate all assets is the soul of a portfolio viewer.
> 
> -- <cite>Aristotélēs</cite>


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
  const portfolio = await getPortfolio({
    keys,
    addresses,
    othertokens,
  });

  printPortfolioNicely(portfolio);
})();
```

#### 🌀 example result
```shell
$ node getPortfolio.js
started to fetch portfolio data ...
(1/5) fetching exchange token counts ...
(2/5) fetching ERC20 token counts ...
(3/5) fetching other token counts ...
(4/5) fetching all token prices ...
(5/5) calculating all token values ...
finished!! Let's go Bitcoin!!

----------------------------------------------------------
₿                    Binance tokens                      ₿
----------------------------------------------------------
| name  | USD value | ratio | BTC value | price  | count |
|-------|-----------|-------|-----------|--------|-------|
| TOTAL | $25000    | 100%  | ₿2.5      | $0     | 0     |
| BTC   | $10000    | 40%   | ₿1        | $10000 | 1     |
| ETH   | $10000    | 40%   | ₿1        | $1000  | 10    |
| BNB   | $5000     | 20%   | ₿0.5      | $100   | 50    |

----------------------------------------------------------
₿                      FTX tokens                        ₿
----------------------------------------------------------
| name  | USD value | ratio | BTC value | price  | count |
|-------|-----------|-------|-----------|--------|-------|
| TOTAL | $15000    | 100%  | ₿1.5      | $0     | 0     |
| BTC   | $10000    | 66%   | ₿1        | $10000 | 1     |
| ATOM  | $10000    | 66%   | ₿1        | $20    | 500   |
| USDT  | $-5000    | -33%  | ₿-0.5     | $1     | -5000 |
// negative value means borrowed from contract or margin
// this can be disabled or customized

----------------------------------------------------------
₿                  ETH + ERC20 tokens                    ₿
----------------------------------------------------------
| name  | USD value | ratio | BTC value | price  | count |
|-------|-----------|-------|-----------|--------|-------|
| TOTAL | $30000    | 100%  | ₿2        | $0     | 0     |
| UNI   | $20000    | 66%   | ₿2        | $50    | 400   |
| ETH   | $10000    | 33%   | ₿1        | $1000  | 10    |

----------------------------------------------------------
₿                     other tokens                       ₿
----------------------------------------------------------
| name  | USD value | ratio | BTC value | price  | count |
|-------|-----------|-------|-----------|--------|-------|
| TOTAL | $50000    | 100%  | ₿5        | $0     | 0     |
| DOT   | $30000    | 60%   | ₿3        | $100   | 300   |
| KSM   | $20000    | 40%   | ₿2        | $1000  | 20    |

----------------------------------------------------------
₿                      all tokens                        ₿
----------------------------------------------------------
| name  | USD value | ratio | BTC value | price  | count |
|-------|-----------|-------|-----------|--------|-------|
| TOTAL | $120000   | 100%  | ₿12       | $0     | 0     |
| DOT   | $30000    | 25%   | ₿3        | $100   | 300   |
| KSM   | $20000    | 16.7% | ₿2        | $1000  | 20    |
| UNI   | $20000    | 16.7% | ₿2        | $50    | 400   |
| BTC   | $20000    | 16.7% | ₿2        | $10000 | 2     |
| ETH   | $20000    | 16.7% | ₿2        | $1000  | 20    |
| ATOM  | $10000    | 8.3%  | ₿1        | $20    | 500   |
| BNB   | $5000     | 4.1%  | ₿0.5      | $100   | 50    |
| USDT  | $-5000    | -4.1% | ₿-0.5     | $1     | -5000 |
```
___
## Advanced Usage
### 🔥 custom printer
> Viewing result nicely is the soul of a portfolio viewer.
> 
> --<cite>Shakespeare</cite>

we can easily print the result in your favorite fashion:
```ts
const myFavoritePrinter = portfolio => { ... };

(async () => {
  const portfolio = await getPortfolio({
    keys,
    addresses,
    othertokens,
  });

  myFavoritePrinter(portfolio);
})();
```
### 🔥 combine results
by default we view each exchange and each ETH address separately:
```shell
----------------------------------------------------------
₿                    Binance tokens                      ₿
----------------------------------------------------------
......
----------------------------------------------------------
₿                      FTX tokens                        ₿
----------------------------------------------------------
......
----------------------------------------------------------
₿                 0x1234...5678 tokens                   ₿
----------------------------------------------------------
......
----------------------------------------------------------
₿                 0x9876...5432 tokens                   ₿
----------------------------------------------------------
```

to simplify our portfolio, we can combine them as a whole
```ts
(async () => {
  const portfolio = await getPortfolio({
    keys,
    addresses,
    othertokens,
    combineExchanges: true,     // <--here!
    combineAddresses: true,     // <--here!
  });

  printPortfolioNicely(portfolio);
})();
```
```shell
----------------------------------------------------------
₿                    exchange tokens                     ₿
----------------------------------------------------------
all exchange tokens combined print here ......
----------------------------------------------------------
₿                      ETH tokens                        ₿
----------------------------------------------------------
all ETH + ERC20 tokens combined print here ......
```

### 🔥 contract/future accounts
For contract/future/margin assets in exchanges, since the `ccxt` library that we rely on doesn't yet provide unified interfaces for these accounts, there is no automatted way to catch them into the exchange result. 

But don't worry, we have 2 different ways to inlcude them into our portfolio:

#### 1) hard code
We can hard code these assets in `othertokens`. (see [example](#any-other-assets) above) 

This is pretty convenient, but we will have to manually update `othertokens` whenever assets change in future accounts.

#### 2) custom `fetcher`
We can also provide a custom `fetcher` for each exchange, or call it `adapter` if you prefer.

This is more flexible and powerful. One huge advantage is being able to include contract positions as assets, **which I personally use A LOT!!** 🥰. It enables us to more precisely calculate portfolio details. 

For example, if we have `1000 USDT collateral`, as well as a contract position of `BTC long (2000 USDT worth)`, then technically our 'real' portfolio should look like
```ts
{
  BTC:   { USD_value: 2000, ... },     // longed
  USDT:  { USD_value: -1000, ... },    // 1000 (collateral) - 2000 (borrowed)
  TOTAL: { USD_value: 1000, ... },     // net worth
}
```
with method 1 (hard code), on the other hand, our 'fake' portfolio looks like
```ts
{
  BTC:  { USD_value: 0, ... },       // totally ignores contract positions!
  USDT: { USD_value: 1000, ... },    // 1000 (collateral) 
  TOTAL: { USD_value: 1000, ... },   // net worth
}
```

#### available fetchers
There are already 2 fetchers that I personally use, feel free to use them directly if you happen to use these exchanges : )

You can also reference them to write your own, or even better, contribute your custom fetchers : )
```ts
const {
  getPortfolio,
  printPortfolioNicely,
  fetchers,
} = require('./crypto-portfolio-viewer');

const {
  fetchBinanceContractBalances,
  fetchFTXContractBalances,
} = fetchers;

(async () => {
  const portfolio = await getPortfolio({
    keys,
    addresses,
    othertokens,
    extraFetchers: {                          // <--here!
      binance: fetchBinanceContractBalances,
      ftx: fetchFTXContractBalances,,
    },
  });

  printPortfolioNicely(portfolio);
})();
```

### 🔥 LP tokens
Currently we don't support automatically "decode" LP tokens to their real values, to track these assets, please hard code them in [other tokens](#any-other-assets).

LP tokens' "decoding" might be implemented in the future : )
___

## APIs Summary
available parameters for `getPortfolio()`:
| param            | type   | default | required? | description                       |
|------------------|--------|---------|-----------|-----------------------------------|
| keys             | object | {}      | no        | exchange api keys                 |
| addresses        | array  | []      | no        | erc20 addresses                   |
| othertokens      | object | {}      | no        | other tokens                      |
| extraFetchers    | object | {}      | no        | customized fetcher for exchanges  |
| combineExchanges | bool   | false   | no        | combine exchange assets in result |
| combineAddresses | bool   | false   | no        | combine erc20 assets in result    |
| verbose | bool   | true   | no        | you know it  |

___
## Bugs? Questions? Contributions?
Feel free to [open an issue](https://github.com/shunjizhan/crypto-portfolio-viewer/issues), or create a pull request!
___
## Special Thanks
Really appreciate all the fantastic works by [ccxt](https://github.com/ccxt/ccxt) and [coingecko-api](https://github.com/miscavage/CoinGecko-API), which provide super useful utilities supporting this library.
___

## UI
coming soon
