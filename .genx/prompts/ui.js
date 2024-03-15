const routesInto = () => console.log(`
  Pages to be added to the navigation header
`);

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
      default: '[{"name":"home"}]',
    },
  ])

  let routesParsed;
  if (routes) {
    try {
      routesParsed = JSON.parse(routes);
    } catch (error) {
      console.error("Error parsing JSON, will use default routes config:", error);
    }
  }

  return {
    routes: routesParsed,
  };
};
