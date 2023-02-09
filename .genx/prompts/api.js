const {websocketValidator} = require('./validators');

const apiHostIntro = () => console.log(`
  In order to connect to a Genesis server, you will need to provide an API_HOST for the WebSocket.
  Optionally, you can enable the initSSO function, which will load provider before starting the application (only if we have one provider).
`);

module.exports = async (inquirer, prevAns = {}) => {
  apiHostIntro();
  const {
    apiHost = prevAns.apiHost,
    initSSO = prevAns.initSSO
  } = await inquirer.prompt([
    {
      name: 'setApiHost',
      type: 'confirm',
      message: 'Set API Host',
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
    {
      name: 'initSSO',
      type: 'confirm',
      message: 'Init SSO connection before loading application',
      default: prevAns.initSSO || false,
    },
  ]);
  return {
    apiHost,
    initSSO
  };
};
