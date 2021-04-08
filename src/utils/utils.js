const { pad } = require('lodash');
const { table } = require('table');
const chalk = require('chalk');

const { log } = console;

const sanitizetokenName = t => t.toLowerCase();
const sanitizeAddress = a => `${a.slice(0, 6)}...${a.slice(a.length - 4)}`;

const sortByValue = values => Object.entries(values).sort(
  ([, { USD: val1 }], [, { USD: val2 }]) => val2 - val1,
);

const filterObj = (obj, func) => Object.fromEntries(
  Object.entries(obj).filter(func),
);
const ignoreValueBelow = x => (([, value]) => value > x);

const toFixedDecimal = decimal => x => parseFloat(parseFloat(x).toFixed(decimal));
const toFixedDecimal1 = toFixedDecimal(1);
const toFixedDecimal2 = toFixedDecimal(2);

const toPrecision5 = x => parseFloat(x.toPrecision(5));

const printValues = values => {
  const total = values.find(([name]) => name === 'TOTAL')[1].USD;

  const res = values.map(val => {
    const [name, { count, USD, BTC, price }] = val;
    const ratio = toFixedDecimal1((USD * 100) / total);

    return [name, `$${USD}`, `${ratio}%`, `₿${BTC}`, `$${toPrecision5(price)}`, count];
  });

  const headerCell = ['name', 'USD', 'ratio', 'BTC', 'price', 'count'];
  const output = table([headerCell, ...res]);

  log(output);
};

const printPortfolioNicely = res => {
  const MSG_LENGTH = 58;

  Object.entries(res).forEach(([name, values]) => {
    log(chalk.green('-'.repeat(MSG_LENGTH)));
    log(chalk.green(`₿ ${pad(`${name} tokens `, MSG_LENGTH - 4)} ₿`));
    log(chalk.green('-'.repeat(MSG_LENGTH)));

    printValues(values);
    log('');
  });
};

module.exports = {
  sanitizetokenName,
  sanitizeAddress,
  filterObj,
  ignoreValueBelow,
  sortByValue,
  toFixedDecimal,
  toFixedDecimal2,
  printPortfolioNicely,
};
