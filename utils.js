const sanitizetokenName = c => c.toLowerCase();

const sortByValue = values => Object.entries(values).sort(
  ([_1, { USD: val1 }], [_2, { USD: val2 }]) => val2 - val1
);

const filterObj = (obj, func) => Object.fromEntries(
  Object.entries(obj).filter(func)
);
const ignoreValueBelow = x => (([key, value]) => value > x);

const toFixedDecimal = decimal => x => parseFloat(parseFloat(x).toFixed(decimal));
const toFixedDecimal2 = toFixedDecimal(2);

module.exports = {
  sanitizetokenName,
  filterObj,
  ignoreValueBelow,
  sortByValue,
  toFixedDecimal,
  toFixedDecimal2,
}