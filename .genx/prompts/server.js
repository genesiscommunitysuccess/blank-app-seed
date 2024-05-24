const { mavenArtifactVersionRegex } = require('./validators');
const { parseJSONArgument } = require('../utils');
const { TEXTS } = require('../static');

const parsecsv = parseJSONArgument('csv', []);

module.exports = async (inquirer, prevAns = {}) => {
  const {
    description = prevAns.description,
    groupId = prevAns.groupId,
    applicationVersion = prevAns.applicationVersion,
    enableDeployPlugin = prevAns.enableDeployPlugin,
    csv = prevAns.csv,
  } = await inquirer.prompt([
    {
      name: 'description',
      type: 'input',
      message: TEXTS.MESSAGE_SERVER_DESCRIPTION,
      when: !prevAns.description,
      default: '\n',
    },
    {
      name: 'groupId',
      type: 'input',
      message: TEXTS.MESSAGE_SERVER_GROUP_ID,
      when: !prevAns.groupId,
      default: 'global.genesis',
    },
    {
      name: 'applicationVersion',
      type: 'input',
      message: TEXTS.MESSAGE_SERVER_APPLICATION_VERSION,
      when: !prevAns.applicationVersion,
      default: '1.0.0-SNAPSHOT',
      validate: mavenArtifactVersionRegex,
    },
    {
      name: 'enableDeployPlugin',
      type: 'confirm',
      message: TEXTS.MESSAGE_SERVER_DEPLOY_PLUGIN,
      when: prevAns.enableDeployPlugin === undefined,
      default: prevAns.enableDeployPlugin || false,
    },
    {
      name: 'csv',
      type: 'input',
      message: TEXTS.MESSAGE_SERVER_CSV,
      when: !prevAns.csv,
      default: '[]',
    },
  ]);

  return {
    description,
    groupId,
    applicationVersion,
    enableDeployPlugin,
    csv: parsecsv(csv),
  };
};
