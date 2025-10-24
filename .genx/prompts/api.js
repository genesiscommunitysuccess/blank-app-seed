const { websocketValidator } = require('./validators');
const { TEXTS } = require('../static');

const defaultHeaderLogo = '';

const apiHostIntro = () => console.log(TEXTS.INTRO_API_HOST);
const ssoIntro = () => console.log(TEXTS.INTRO_API_SSO);

module.exports = async (inquirer, prevAns = {}) => {
  apiHostIntro();
  const { apiHost = prevAns.apiHost } = await inquirer.prompt([
    {
      name: 'apiHost',
      type: 'input',
      message: TEXTS.MESSAGE_API_HOST,
      when: !prevAns.apiHost,
      default: 'ws://localhost:9064',
      validate: websocketValidator,
    },
  ]);
  ssoIntro();
  const { enableSSO = prevAns.enableSSO } = await inquirer.prompt([
    {
      name: 'enableSSO',
      type: 'confirm',
      message: TEXTS.MESSAGE_API_SSO,
      default: prevAns.enableSSO || false,
      when: prevAns.enableSSO === undefined,
    },
  ]);
  
  const { headerLogo = prevAns.headerLogo } = await inquirer.prompt([
    {
      name: 'headerLogo',
      type: 'input',
      message: 'Header logo file path (optional)',
      default: defaultHeaderLogo,
      when: prevAns.headerLogo === undefined,
    },
  ]);
  
  return {
    apiHost,
    enableSSO,
    headerLogo,
  };
};
