const { resolve } = require('node:path');
const {
  DIR_TEMPLATE_ROOT_ALIAS,
  DIRS_MAP,
  DIR_TEMPLATE_BY_FRAMEWORK,
} = require('../static');

const registerPartials = ({ registerPartial }, framework) => {
  const rootTemplateDir = `../${DIRS_MAP.get(DIR_TEMPLATE_ROOT_ALIAS)}`;
  const sourceTemplateDir = `../${DIR_TEMPLATE_BY_FRAMEWORK[framework]}`;

  registerPartial(
    'grid-layout',
    resolve(__dirname, `${rootTemplateDir}/gridLayout.hbs`),
  );
  registerPartial(
    'tabs-layout',
    resolve(__dirname, `${rootTemplateDir}/tabsLayout.hbs`),
  );
  registerPartial(
    'horizontal-layout',
    resolve(__dirname, `${rootTemplateDir}/horizontalLayout.hbs`),
  );
  registerPartial(
    'smart-form',
    resolve(__dirname, `${sourceTemplateDir}/form.hbs`),
  );
  registerPartial(
    'chart',
    resolve(__dirname, `${sourceTemplateDir}/chart.hbs`),
  );
  registerPartial(
    'entity-manager',
    resolve(__dirname, `${sourceTemplateDir}/entityManager.hbs`),
  );
  registerPartial(
    'grid-pro',
    resolve(__dirname, `${sourceTemplateDir}/grid.hbs`),
  );
};

module.exports = registerPartials;
