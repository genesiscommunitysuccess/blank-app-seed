const {mavenArtifactVersionRegex} = require('./validators');

const parsecsv = (inputEntities) => {
  if (!inputEntities){
    return [];
  }
  try {
    return JSON.parse(inputEntities);
  } catch (error) {
    console.error("Error parsing `csv` parameter as JSON:", error.message);
    return [];
  }
}

module.exports = async (inquirer, prevAns = {}) => {
    const {
      groupId = prevAns.groupId,
      applicationVersion = prevAns.applicationVersion,
      enableDeployPlugin = prevAns.enableDeployPlugin,
      csv = prevAns.csv,
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
      {
        name: 'csv',
        type: 'input',
        message: 'Generate empty CSV for entities? (config in json format)',
        when: !prevAns.csv,
        default: '[]'
      },
    ]);

    return {
      groupId,
      applicationVersion,
      enableDeployPlugin,
      csv: parsecsv(csv)
    };
  };