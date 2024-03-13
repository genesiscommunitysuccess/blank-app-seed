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
      message: 'Pages in comma separated format e.g. home,dashboard,admin',
      when: !prevAns.routes,
      default: prevAns.routes || 'home',
    },
  ])

  return {
    routes: routes?.split(','),
  };
};
