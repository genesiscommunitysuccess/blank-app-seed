const {mavenArtifactVersionRegex} = require('./validators');

module.exports = async (inquirer, prevAns = {}) => {
    const {
      groupId = prevAns.groupId,
      applicationVersion = prevAns.applicationVersion
    } = await inquirer.prompt([
      {
        name: 'groupId',
        type: 'input',
        message: 'Group Id',
        when: !prevAns.pkgScope,
        default:'global.genesis'
      },
      {
        name: 'applicationVersion',
        type: 'input',
        message: 'Application Version',
        when: !prevAns.groupId,
        default:'1.0.0-SNAPSHOT',
        validate: mavenArtifactVersionRegex
      },
    ]);
    return {
      groupId,
      applicationVersion
    };
  };