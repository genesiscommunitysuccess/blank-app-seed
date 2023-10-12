const { description, license, name, version } = require("./package.json");

const summary = `
  Name: ${name}
  Description: ${description}
  Version: ${version}
  License: ${license}
`;

const nextStepsMessage = `
 > Go into the (web) client directory with \`cd client\`\n
 > Install dependencies with \`npm run bootstrap\`\n
 > Start the development server with \`npm run dev\`
`;

module.exports = {
  description,
  license,
  name,
  summary,
  version,
  nextStepsMessage,
};
