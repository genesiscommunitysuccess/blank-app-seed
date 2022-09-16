const path = require('path');
const yargsParser = require('yargs-parser');

const rootPath = target => path.resolve(__dirname, '../', target);

/**
 * Remove these once the CLI PR merges and use these utils from that directly, remove the yargs-parser dep at that point
 */
const ignoreArgvCount = 2;
const argv = yargsParser(process.argv.slice(ignoreArgvCount));
const env = process.env;

module.exports = {
  argv,
  env,
  rootPath,
}
