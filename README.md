# crypto portfolio viwer
View your aggregated cryptocurrency portfolio automagically, no matter where the assets are located:
- exchanges
- ETH wallets
- anywhere else, no problem!

## run
```ts
const {
  getMyPortfolio,
  printPortfolioNicely,
} = require('./crypto-portfolio-viewer');

/* --- exchange api keys --- */
const keys = {                               
  binance: {
    apiKey: "xxxxxxxxxx",
    secret: "yyyyyyyyyy"
  },
  ftx: {
    apiKey: "aaaaaaaaaa",
    secret: "bbbbbbbbbb",
  },
  /* ...... */
};

/* --- eth addresses --- */
const addresses = [                         
  'eth address 1',
  'eth address 2',
  /* ...... */
];

/* --- any other tokens to be included --- */
const othertokens = {                        
  "BTC": [8.5],         // in cold wallet
  "BNB": [200],         // in BSC
  "ETH": [10, 30],      // uni-LP, sushi-LP
  "USDT": [
    1000,               // borrowed by Alex
    2000,               // borrowed by Kate
    5000,               // my mining machine's value
  ]
};

(run = async () => {
  const allTokenValues = await getMyPortfolio({
    keys,
    addresses,
    othertokens,
    combineExchanges: false,                    // view exchange assets separately
  });

  printPortfolioNicely(allTokenValues);
})();
```

example result
```shell
----------------------------------------------------------
₿                    Binance tokens                      ₿
----------------------------------------------------------
[
  [ 'TOTAL', { count: 0, USD: 10000, BTC: 1 } ],
  [ 'BNB', { count: 300, USD: 5000, BTC: 0.5 } ],
  [ 'REEF', { count: 100, USD: 3000, BTC: 0.3 } ],
  [ 'USDT', { count: 2000, USD: 2000, BTC: 0.2 } ]
]

----------------------------------------------------------
₿                      FTX tokens                        ₿
----------------------------------------------------------
[
  [ 'TOTAL', { count: 0, USD: 4500, BTC: 0.45 } ],
  [ 'FTT', { count: 120.5, USD: 3400, BTC: 0.34 } ],
  [ 'ATOM', { count: 100, USD: 1000, BTC: 0.1 } ],
  [ 'ETH', { count: 0.6, USD: 600, BTC: 0.06 } ],
  [ 'USDT', { count: -500, USD: -500, BTC: -0.05 } ]        
  // negative means borrowed from contract or margin, this calculation can be disabled.
]

----------------------------------------------------------
₿                  ETH + ERC20 tokens                    ₿
----------------------------------------------------------
[
  [ 'TOTAL', { count: 0, USD: 12000, BTC: 1.2 } ],
  [ 'ETH', { count: 5, USD: 5000, BTC: 0.5 } ],
  [ 'UNI', { count: 2014.06, USD: 3000, BTC: 0.3 } ],
  [ 'SUSHI', { count: 1534.32, USD: 2000, BTC: 0.2 } ]
  [ 'USDC', { count: 20000, USD: 2000, BTC: 0.2 } ],
]

----------------------------------------------------------
₿                     other tokens                       ₿
----------------------------------------------------------
[
  [ 'TOTAL', { count: 0, USD: 9500, BTC: 0.95 } ],
  [ 'KSM', { count: 688, USD: 5000, BTC: 0.5 } ],
  [ 'DOT', { count: 1000, USD: 3000, BTC: 0.3 } ],
  [ 'ATOM', { count: 150, USD: 1500, BTC: 0.15 } ],
]

----------------------------------------------------------
₿                      all tokens                        ₿
----------------------------------------------------------
[
  [ 'TOTAL', { count: 0, USD: 36000, BTC: 3.6 } ],
  [ 'ETH', { count: 5.6, USD: 5600, BTC: 0.56 } ],
  [ 'BNB', { count: 300, USD: 5000, BTC: 0.5 } ],
  [ 'KSM', { count: 688, USD: 5000, BTC: 0.5 } ],
  [ 'FTT', { count: 120.5, USD: 3400, BTC: 0.34 } ],
  [ 'UNI', { count: 2014.06, USD: 3000, BTC: 0.3 } ],
  [ 'REEF', { count: 100, USD: 3000, BTC: 0.3 } ],
  [ 'DOT', { count: 1000, USD: 3000, BTC: 0.3 } ],
  [ 'ATOM', { count: 250, USD: 2500, BTC: 0.25 } ],
  [ 'SUSHI', { count: 1534.32, USD: 2000, BTC: 0.2 } ]
  [ 'USDC', { count: 2000, USD: 2000, BTC: 0.2 } ],
  [ 'USDT', { count: 1500, USD: 1500, BTC: 0.15 } ],
]
```
