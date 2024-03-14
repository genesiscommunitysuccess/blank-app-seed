const routesInto = () => console.log(`
  Pages to be added to the navigation header
`);

const routes2 = [
  {
    name: "home",
    tiles: [
      {
        title: "Entity manager tile",
        type: "entityManager",
        config: {
          resourceName: "ALL_COUNTERPARTYS",
          title: "Counterparty Management",
          updateEvent: "EVENT_COUNTERPARTY_MODIFY",
          deleteEvent: "EVENT_COUNTERPARTY_DELETE",
          createEvent: "EVENT_COUNTERPARTY_INSERT"
        }
      },
      {
        title: "Form tile",
        type: "form",
        config: {
          resourceName: "EVENT_TRADE_INSERT"
        }
      }
    ]
  },
  {
    name: "page-2",
    tiles: [
      {
        title: "Grid Tile",
        type: "grid",
        config: {
          resourceName: "ALL_POSITIONS"
        }
      },
      {
        title: "Charts Tile",
        type: "chart",
        config: {
          type: "column",
          resourceName: "ALL_STOCKS",
          xField: 'SYMBOL',
          yField: 'TRADING_VOLUME'
        }
      }
    ]
  }
]

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
    routes: routes2,
  };
};
