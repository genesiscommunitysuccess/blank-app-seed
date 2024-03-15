const routesInto = () => console.log(`
  Pages to be added to the navigation header
`);

const defaultRoutes = '[{"name":"home"}]';

module.exports = async (inquirer, prevAns = {}) => {
  routesInto();
  const {
    routes = prevAns.routes,
  } = await inquirer.prompt([
    {
      name: 'routes',
      type: 'input',
      message: 'Pages config in json format',
      when: !prevAns.routes,
      default: defaultRoutes,
    },
  ])

  let routesParsed;
  try {
    routesParsed = JSON.parse(routes);
  } catch (error) {
    console.error("Error parsing `routes` parameter as JSON:", error.message);
    console.log("Falling back to the default routes value");
    routesParsed = JSON.parse(defaultRoutes);
  }

  return {
    routes: routesParsed,
  };
};
