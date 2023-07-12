const {websocketValidator} = require('./validators');

const apiHostIntro = () => console.log(`
  In order to connect to a Genesis server, you will need to provide an API_HOST for the WebSocket.
`);

const ssoIntro = () => console.log(`
  Optionally, you can enable the SSO function, which will redirect to identity provider before starting the application (given we only have one identity provider).
`);

module.exports = async (inquirer, prevAns = {}) => {
  apiHostIntro();
  const {
    apiHost = prevAns.apiHost,
  } = await inquirer.prompt([
    {
      name: 'setApiHost',
      type: 'confirm',
      message: 'Set API Host',
      when: !prevAns.apiHost,
      default: true,
    },
    {
      name: 'apiHost',
      type: 'input',
      message: 'API Host (with websocket prefix and suffix if any)',
      when: ({setApiHost}) => setApiHost,
      default: prevAns.apiHost || 'ws://localhost/gwf/',
      validate: websocketValidator,
    },
  ])
  ssoIntro();
  const {
    enableSSO = prevAns.enableSSO
  } = await inquirer.prompt([
    {
      name: 'enableSSO',
      type: 'confirm',
      message: 'Init SSO connection before loading application',
      default: prevAns.enableSSO || false,
      when: typeof prevAns.enableSSO === 'undefined',
    },
  ]);
  return {
    apiHost,
    enableSSO
  };
};
