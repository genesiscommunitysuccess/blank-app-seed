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
        title: "Charts Tile 1",
        type: "chart",
        config: {
          type: "line",
          resourceName: "ALL_POSITIONS",
          xField: 'INSTRUMENT_NAME',
          yField: 'VALUE'
        }
      },
      {
        title: "Charts Tile 2",
        type: "chart",
        config: {
          type: "pie",
          resourceName: "ALL_POSITIONS",
          xField: 'INSTRUMENT_NAME',
          yField: 'VALUE'
        },
      },
      {
        title: "Charts Tile 3",
        type: "chart",
        config: {
          type: "column",
          resourceName: "ALL_POSITIONS",
          xField: 'INSTRUMENT_ID',
          yField: 'VALUE'
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
