const isString = (input) => {
  return (
    typeof input === 'string' &&
    Object.prototype.toString.call(input) === '[object String]'
  );
};

module.exports = isString;
