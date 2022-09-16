const {description, license, name, version} = require('../client/package.json');

const summary = `
  Name: ${name}
  Description: ${description}
  Version: ${version}
  License: ${license}
`;

module.exports = {
  description,
  license,
  name,
  summary,
  version,
}
