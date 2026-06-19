const { existsSync, mkdirSync } = require('node:fs');

const makeDirectory = (directory) => {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }
};

module.exports = makeDirectory;
