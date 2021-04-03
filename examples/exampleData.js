module.exports = {
  keys: {
    binance: {
      apiKey: 'xxxxxxxxxx',
      secret: 'yyyyyyyyyy',
    },
    ftx: {
      apiKey: 'aaaaaaaaaa',
      secret: 'bbbbbbbbbb',
    },
    // ......
  },

  addresses: [
    '0x075c92cd8db45f0f3270d6aa9161cc3402dce8ea',   // some random address found online...
    // ......
  ],

  othertokens: {
    BTC: [8.5],         // in cold wallet
    BNB: [200],         // in BSC
    ETH: [10, 30],      // uni-LP, sushi-LP
    USDT: [
      1000,               // borrowed by Alex
      2000,               // borrowed by Kate
      5000,               // my mining machine's value
    ],
    // ......
  },
};
