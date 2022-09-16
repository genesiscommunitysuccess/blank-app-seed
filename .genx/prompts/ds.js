const {baseDsPackageValidator, safeName} = require('./validators');
const {dsInto} = require('./messages');

module.exports = async (inquirer, prevAns = {}) => {
  dsInto();
  const {
    dsName = prevAns.dsName,
    baseDsPackage = prevAns.baseDsPackage,
  } = await inquirer.prompt([
    {
      name: 'createDS',
      type: 'confirm',
      message: 'Create design system',
      default: true,
    },
    {
      name: 'dsName',
      type: 'input',
      message: 'Design system name',
      when: ({createDS}) => createDS,
      default: prevAns.dsName || 'alpha',
      validate: safeName,
    },
    {
      name: 'baseDsPackage',
      type: 'input',
      message: 'Base design system package (@latest will be used)',
      when: ({createDS}) => createDS,
      default: prevAns.baseDsPackage || '@genesislcap/foundation-ui',
      validate: baseDsPackageValidator,
    },
  ]);
  return {
    dsName,
    baseDsPackage,
  };
};
