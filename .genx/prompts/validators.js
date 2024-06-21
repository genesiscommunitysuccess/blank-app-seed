const { TEXTS } = require('../static');

const { validateFrameworkAlias } = require('../utils');

const websocketRegex =
  /wss?:\/\/[-a-zA-Z0-9@:%._+~#=]{1,256}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)\b\/*$/;
const mavenArtifactVersionRegex = /([\d+{1,3}.A-Z]+)/;

const frameworkValidator = (value) =>
  validateFrameworkAlias(value) || TEXTS.ERROR_VALIDATOR_FRAMEWORK;
const websocketValidator = (value) =>
  websocketRegex.test(value) || TEXTS.ERROR_VALIDATOR_WEBSOCKET;
const mavenArtifactVersionValidator = (value) =>
  mavenArtifactVersionRegex.test(value) || TEXTS.ERROR_VALIDATOR_VERSION;

module.exports = {
  frameworkValidator,
  websocketValidator,
  mavenArtifactVersionValidator,
};
