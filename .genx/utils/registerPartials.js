const { resolve } = require('node:path');

const registerPartials = ({ registerPartial }) => {
  registerPartial(
    'grid-layout',
    resolve(__dirname, 'templates/gridLayout.hbs'),
  );
  registerPartial(
    'tabs-layout',
    resolve(__dirname, 'templates/tabsLayout.hbs'),
  );
  registerPartial(
    'horizontal-layout',
    resolve(__dirname, 'templates/horizontalLayout.hbs'),
  );
  registerPartial('smart-form', resolve(__dirname, 'templates/form.hbs'));
  registerPartial('chart', resolve(__dirname, 'templates/chart.hbs'));
  registerPartial(
    'entity-manager',
    resolve(__dirname, 'templates/entityManager.hbs'),
  );
  registerPartial('grid-pro', resolve(__dirname, 'templates/grid.hbs'));
};

module.exports = registerPartials;
