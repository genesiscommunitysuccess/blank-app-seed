const { existsSync, mkdirSync } = require('node:fs');

const makeDirectory = (directory) => {
  if (!existsSync(directory)) {
    mkdirSync(directory);
  }
};

module.exports = makeDirectory;
