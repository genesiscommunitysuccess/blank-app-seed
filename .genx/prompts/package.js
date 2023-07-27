const {npmPackageValidator} = require('./validators');

module.exports = async (inquirer, prevAns = {}) => {
  const {
    pkgName = prevAns.pkgName || prevAns.appName,
  } = await inquirer.prompt([
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
    pkgName,
  };
};
