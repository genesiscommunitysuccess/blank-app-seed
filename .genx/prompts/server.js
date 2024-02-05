const {mavenArtifactVersionRegex} = require('./validators');

module.exports = async (inquirer, prevAns = {}) => {
    const {
      groupId = prevAns.groupId,
      applicationVersion = prevAns.applicationVersion,
      enableDeployPlugin = prevAns.enableDeployPlugin
    } = await inquirer.prompt([
      {
        name: 'groupId',
        type: 'input',
        message: 'Group Id',
        when: !prevAns.groupId,
        default:'global.genesis'
      },
      {
        name: 'applicationVersion',
        type: 'input',
        message: 'Application Version',
        when: !prevAns.applicationVersion,
        default:'1.0.0-SNAPSHOT',
        validate: mavenArtifactVersionRegex
      },
      {
        name: 'enableDeployPlugin',
        type: 'confirm',
        message: 'Enable deploy plugin?',
        when: prevAns.enableDeployPlugin === undefined,
        default: prevAns.enableDeployPlugin || false
      },
    ]);
    return {
      groupId,
      applicationVersion,
      enableDeployPlugin,
    };
  };