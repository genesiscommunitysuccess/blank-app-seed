const { description, license, name, version } = require('./package.json');

const summary = `
  Name: ${name}
  Description: ${description}
  Version: ${version}
  License: ${license}
`;

const nextStepsMessage = `
 > Initialise a new repository e.g.:
 \`git init\`
 \`git add --all\`
 \`git commit -m 'Initial commit'\`\n
 > Start Web client:
 \`cd client\`
 \`npm run bootstrap\`
 \`npm run dev\`
`;

module.exports = {
  description,
  license,
  name,
  summary,
  version,
  nextStepsMessage,
};
