const routesInto = () => console.log(`
  Pages to be added to the navigation header
`);

const defaultRoutes = '[{"name":"home"}]';

module.exports = async (inquirer, prevAns = {}) => {
  routesInto();
  const {
    routes = prevAns.routes,
    fdc3 = prevAns.fdc3,
    fdc3ListenChannel = prevAns.fdc3ListenChannel
  } = await inquirer.prompt([
    {
      name: 'routes',
      type: 'input',
      message: 'Pages config in json format',
      when: !prevAns.routes,
      default: defaultRoutes,
    },
    {
      name: 'fdc3',
      type: 'confirm',
      message: 'Enable FDC3',
      when: !prevAns.fdc3,
      default: prevAns.fdc3 || false,
    },
    {
      name: 'fdc3ListenChannel',
      type: 'confirm',
      message: 'Listen to an fdc channel config in json format',
      when: !prevAns.fdc3ListenChannel,
      default: prevAns.fdc3ListenChannel || false,
    },
  ])

  let fdc3ListenChannelParsed;
  if (fdc3ListenChannel) {
    try {
      fdc3ListenChannelParsed = JSON.parse(fdc3ListenChannel);
    } catch (error) {
      console.error("Error parsing `fdc3ListenChannel` parameter as JSON:", error.message);
      console.log("Falling back to null for fdc3ListenChannel value");
      fdc3ListenChannelParsed = null;
    }
  }

  let routesParsed;
  if (routes) {
    try {
      routesParsed = JSON.parse(routes);
    } catch (error) {
      console.error("Error parsing `routes` parameter as JSON:", error.message);
      console.log("Falling back to the default routes value");
      routesParsed = JSON.parse(defaultRoutes);
    }
  } else {
    routesParsed = JSON.parse(defaultRoutes);
  }

  return {
    routes: routesParsed,
    fdc3,
    fdc3ListenChannel: fdc3ListenChannelParsed
  };
};
