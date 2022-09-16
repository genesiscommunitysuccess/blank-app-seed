const {mavenArtifactVersionRegex} = require('./validators');

module.exports = async (inquirer, prevAns = {}) => {
    () => console.log(`Enter Genesis Server version`);
    const {
      genesisVersion = prevAns.genesisVersion,
      deployPluginVersion = prevAns.deployPluginVersion,
      kotlinVersion = prevAns.kotlinVersion,
      groupId = prevAns.groupId,
      applicationVersion = prevAns.applicationVersion
    } = await inquirer.prompt([
      {
        name: 'genesisVersion',
        type: 'input',
        message: 'Genesis Server version',
        when: !prevAns.pkgScope,
        default: '6.1.2',
        validate: mavenArtifactVersionRegex,
      },
      {
        name: 'deployPluginVersion',
        type: 'input',
        message: 'Genesis Deploy plugin version',
        when: !prevAns.genesisVersion,
        default:'6.1.2',
        validate: mavenArtifactVersionRegex,
      },
      {
        name: 'kotlinVersion',
        type: 'input',
        message: 'Kotlin version',
        when: !prevAns.deployPluginVersion,
        default:'1.6.10',
        validate: mavenArtifactVersionRegex,
      },
      {
        name: 'groupId',
        type: 'input',
        message: 'Group Id',
        when: !prevAns.kotlinVersion,
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
      genesisVersion,
      deployPluginVersion,
      kotlinVersion,
      groupId,
      applicationVersion
    };
  };