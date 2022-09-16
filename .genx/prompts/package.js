const {npmPackageValidator, safeName} = require('./validators');
const {scopedPackageInto} = require('./messages');

module.exports = async (inquirer, prevAns = {}) => {
  scopedPackageInto('genesislcap', 'some-app');
  const {
    pkgScope = prevAns.pkgScope,
    pkgName = prevAns.pkgName,
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
      when: !prevAns.pkgName,
      validate: npmPackageValidator,
    },
  ]);
  return {
    pkgScope,
    pkgName,
    workspaceName: pkgScope,
  };
};
