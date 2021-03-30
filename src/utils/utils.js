const { pad } = require('lodash');

const sanitizetokenName = c => c.toLowerCase();

const sortByValue = values => Object.entries(values).sort(
  ([_1, { USD: val1 }], [_2, { USD: val2 }]) => val2 - val1,
);

const filterObj = (obj, func) => Object.fromEntries(
  Object.entries(obj).filter(func),
);
const ignoreValueBelow = x => (([key, value]) => value > x);

const toFixedDecimal = decimal => x => parseFloat(parseFloat(x).toFixed(decimal));
const toFixedDecimal2 = toFixedDecimal(2);

const printPortfolioNicely = res => {
  const msgLength = 58;
  Object.entries(res).forEach(([name, values]) => {
    console.log('-'.repeat(msgLength));
    console.log(`₿ ${pad(`${name} tokens `, msgLength - 4)} ₿`);
    console.log('-'.repeat(msgLength));
    console.log(values);
    console.log('');
  });
};

module.exports = {
  sanitizetokenName,
  filterObj,
  ignoreValueBelow,
  sortByValue,
  toFixedDecimal,
  toFixedDecimal2,
  printPortfolioNicely,
};
