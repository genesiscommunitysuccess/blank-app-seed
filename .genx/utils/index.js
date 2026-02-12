const excludeFrameworks = require('./excludeFrameworks');
const deleteGradleWrappers = require('./deleteGradleWrappers');
const formatRouteData = require('./formatRouteData');
const generateRoute = require('./generateRoute');
const generateCsv = require('./generateCsv');
const getCombinedCsvData = require('./getCombinedCsvData');
const generateStore = require('./generateStore');
const makeDirectory = require('./makeDirectory');
const normalizeFrameworkAlias = require('./normalizeFrameworkAlias');
const parseJSONArgument = require('./parseJSONArgument');
const registerPartials = require('./registerPartials');
const validateRoute = require('./validateRoute');
const validateFrameworkAlias = require('./validateFrameworkAlias');
const fontUtils = require('./fontUtils');

module.exports = {
  deleteGradleWrappers,
  excludeFrameworks,
  formatRouteData,
  generateRoute,
  generateCsv,
  getCombinedCsvData,
  generateStore,
  makeDirectory,
  normalizeFrameworkAlias,
  parseJSONArgument,
  registerPartials,
  validateFrameworkAlias,
  validateRoute,
  fontUtils,
};
