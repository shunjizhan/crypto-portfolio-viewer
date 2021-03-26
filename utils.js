const sanitizetokenName = c => c.toLowerCase();

const sortByValue = values => Object.entries(values).sort(
  ([_1, { USD: val1 }], [_2, { USD: val2 }]) => val2 - val1
);

const filterObj = (obj, func) => Object.fromEntries(
  Object.entries(obj).filter(func)
);
const ignoreValueBelow = x => (([key, value]) => value > x);
const ignoreAbsValueBelow = x => (([key, value]) => Math.abs(value) > x);

module.exports = {
  sanitizetokenName,
  filterObj,
  ignoreValueBelow,
  sortByValue,
}