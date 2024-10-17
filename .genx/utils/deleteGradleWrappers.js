const { rmdirSync } = require('node:fs');
const { resolve } = require('node:path');

const deleteGradleWrappers = (
  paths = ['../../gradle', '../../server/gradle'],
) => {
  paths.forEach((p) => {
    rmdirSync(resolve(__dirname, p), { recursive: true, force: true });
  });
};

module.exports = deleteGradleWrappers;
