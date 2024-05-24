const { websocketValidator } = require('./validators');
const { TEXTS } = require('../static');

const apiHostIntro = () => console.log(TEXTS.INTRO_API_HOST);
const ssoIntro = () => console.log(TEXTS.INTRO_API_SSO);

module.exports = async (inquirer, prevAns = {}) => {
  apiHostIntro();
  const { apiHost = prevAns.apiHost } = await inquirer.prompt([
    {
      name: 'setApiHost',
      type: 'confirm',
      message: TEXTS.MESSAGE_API_SET_HOST,
      when: !prevAns.apiHost,
      default: true,
    },
    {
      name: 'apiHost',
      type: 'input',
      message: TEXTS.MESSAGE_API_HOST,
      when: ({ setApiHost }) => setApiHost,
      default: prevAns.apiHost || 'ws://localhost/gwf/',
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
  return {
    apiHost,
    enableSSO,
  };
};
