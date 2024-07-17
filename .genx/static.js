const FRAMEWORK_WEB_COMPONENTS_ALIAS = 'webcomponents';
const FRAMEWORK_ANGULAR_ALIAS = 'angular';
const FRAMEWORK_REACT_ALIAS = 'react';

const FRAMEWORKS_ALIAS = [
  FRAMEWORK_WEB_COMPONENTS_ALIAS,
  FRAMEWORK_ANGULAR_ALIAS,
  FRAMEWORK_REACT_ALIAS,
];

const FRAMEWORKS_LABEL_MAP = new Map([
  [FRAMEWORK_WEB_COMPONENTS_ALIAS, 'Web Components'],
  [FRAMEWORK_ANGULAR_ALIAS, 'Angular'],
  [FRAMEWORK_REACT_ALIAS, 'React'],
]);

const FRAMEWORKS_DIR_MAP = new Map([
  [FRAMEWORK_WEB_COMPONENTS_ALIAS, 'web-components'],
  [FRAMEWORK_ANGULAR_ALIAS, 'angular'],
  [FRAMEWORK_REACT_ALIAS, 'react'],
]);

const DEFAULT_FRAMEWORK_ALIAS = FRAMEWORK_WEB_COMPONENTS_ALIAS;

const DIR_CLIENT_MAIN_ALIAS = 'client';
const DIR_CLIENT_TEMP_ALIAS = 'client-tmp';
const DIR_TEMPLATE_ROOT_ALIAS = 'templates';
const DIR_TEMPLATE_ANGULAR_ALIAS = 'angular';
const DIR_TEMPLATE_WEB_COMPONENT_ALIAS = 'web-components';
const DIR_TEMPLATE_REACT_ALIAS = 'react';

const DIRS_MAP = new Map([
  [DIR_CLIENT_MAIN_ALIAS, DIR_CLIENT_MAIN_ALIAS],
  [DIR_CLIENT_TEMP_ALIAS, DIR_CLIENT_TEMP_ALIAS],
  [DIR_TEMPLATE_ROOT_ALIAS, DIR_TEMPLATE_ROOT_ALIAS],
  [
    DIR_TEMPLATE_ANGULAR_ALIAS,
    `${DIR_TEMPLATE_ROOT_ALIAS}/${DIR_TEMPLATE_ANGULAR_ALIAS}`,
  ],
  [
    DIR_TEMPLATE_WEB_COMPONENT_ALIAS,
    `${DIR_TEMPLATE_ROOT_ALIAS}/${DIR_TEMPLATE_WEB_COMPONENT_ALIAS}`,
  ],
  [
    DIR_TEMPLATE_REACT_ALIAS,
    `${DIR_TEMPLATE_ROOT_ALIAS}/${DIR_TEMPLATE_REACT_ALIAS}`,
  ],
]);

const DIR_TEMPLATE_BY_FRAMEWORK = {
  [FRAMEWORK_WEB_COMPONENTS_ALIAS]: DIRS_MAP.get(
    DIR_TEMPLATE_WEB_COMPONENT_ALIAS,
  ),
  [FRAMEWORK_ANGULAR_ALIAS]: DIRS_MAP.get(DIR_TEMPLATE_ANGULAR_ALIAS),
  [FRAMEWORK_REACT_ALIAS]: DIRS_MAP.get(FRAMEWORK_REACT_ALIAS),
};

const COMPONENT_TYPE = {
  'entity-manager': 'manager',
  'grid-pro': 'grid',
  'smart-form': 'form',
  chart: 'chart',
};

const TEXTS = {
  INTRO_API_HOST:
    'You can override the default Genesis server URL used during local developent.',
  INTRO_API_SSO:
    'Optionally, you can enable the SSO function, which will redirect to identity provider before starting the application (given we only have one identity provider).',
  MESSAGE_API_SET_HOST: 'Set API Host',
  MESSAGE_API_HOST: 'API Host (with WebSocket prefix and suffix if any)',
  MESSAGE_API_SSO: 'Init SSO connection before loading application',
  MESSAGE_SERVER_DESCRIPTION: 'Project Description',
  MESSAGE_SERVER_GROUP_ID: 'Group Id',
  MESSAGE_SERVER_APPLICATION_VERSION: 'Application Version',
  MESSAGE_SERVER_DEPLOY_PLUGIN: 'Enable deploy plugin?',
  MESSAGE_SERVER_CSV:
    'Generate empty CSV for entities? (config in JSON format)',
  MESSAGE_UI_ROTUES: 'Pages config in JSON format',
  MESSAGE_UI_CONFIG: 'UI configuration in JSON format',
  MESSAGE_UI_FRAMEWORK: 'Framework',
  ERROR_VALIDATOR_FRAMEWORK: 'Selected framework is not supported',
  ERROR_VALIDATOR_WEBSOCKET: 'Not a valid websocket',
  ERROR_VALIDATOR_VERSION: 'Not a valid version',
};

module.exports = {
  COMPONENT_TYPE,
  FRAMEWORK_WEB_COMPONENTS_ALIAS,
  FRAMEWORK_ANGULAR_ALIAS,
  FRAMEWORK_REACT_ALIAS,
  FRAMEWORKS_ALIAS,
  FRAMEWORKS_LABEL_MAP,
  FRAMEWORKS_DIR_MAP,
  DEFAULT_FRAMEWORK_ALIAS,
  DIR_CLIENT_MAIN_ALIAS,
  DIR_CLIENT_TEMP_ALIAS,
  DIR_TEMPLATE_ROOT_ALIAS,
  DIR_TEMPLATE_ANGULAR_ALIAS,
  DIR_TEMPLATE_WEB_COMPONENT_ALIAS,
  DIR_TEMPLATE_REACT_ALIAS,
  DIR_TEMPLATE_BY_FRAMEWORK,
  DIRS_MAP,
  TEXTS,
};
