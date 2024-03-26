const routesInto = () => console.log(`
  Pages to be added to the navigation header
`);

const defaultRoutes = '[{"name":"home"}]';

module.exports = async (inquirer, prevAns = {}) => {
  routesInto();
  const {
    routes = prevAns.routes,
    fdc3 = prevAns.fdc3,
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
  ])

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
  };
};
