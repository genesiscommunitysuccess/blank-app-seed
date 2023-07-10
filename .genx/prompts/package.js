const {npmPackageValidator, safeName} = require('./validators');
const {scopedPackageIntro} = require('./messages');

module.exports = async (inquirer, prevAns = {}) => {
  scopedPackageIntro('genesislcap', 'some-app');
  const {
    pkgScope = prevAns.pkgScope,
    pkgName = prevAns.pkgName || prevAns.appName,
  } = await inquirer.prompt([
    {
      name: 'pkgScope',
      type: 'input',
      message: 'Package scope (without the @)',
      when: !prevAns.pkgScope,
      default: 'genesislcap',
      validate: safeName,
    },
    {
      name: 'pkgName',
      type: 'input',
      message: 'Package name',
      when: !prevAns.pkgName && !prevAns.appName,
      default: prevAns.pkgName || prevAns.appName,
      validate: npmPackageValidator,
    },
  ]);
  return {
    pkgScope,
    pkgName,
    workspaceName: pkgScope,
  };
};
