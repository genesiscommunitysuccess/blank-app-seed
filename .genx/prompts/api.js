const {websocketValidator} = require('./validators');

const apiHostIntro = () => console.log(`
  In order to connect to a Genesis server, you will need to provide an API_HOST for the WebSocket.
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
  ]);
  return {
    apiHost,
  };
};
