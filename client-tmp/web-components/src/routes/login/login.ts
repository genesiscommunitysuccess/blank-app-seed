import {
  template,
  styles,
  TemplateOptions,
} from '@genesislcap/foundation-login';

// eslint-disable-next-line
declare var ENABLE_SSO: string;

const ssoSettings =
  typeof ENABLE_SSO !== 'undefined' && ENABLE_SSO === 'true'
    ? {
      autoAuth: true,
      sso: {
        toggled: true,
        identityProvidersPath: 'sso/list',
      },
    }
    : {};

export const loginTemplateOptions: TemplateOptions = {
  anchor: 'rapid-anchor',
  button: 'rapid-button',
  card: 'rapid-card',
  checkbox: 'rapid-checkbox',
  listboxOption: 'rapid-option',
  provider: 'template',
  router: 'foundation-router',
  select: 'rapid-select',
  textField: 'rapid-text-field',
};

export const loginElement = async (container, loginConfig) => {
  const {configure, define} = await import(
    /* webpackChunkName: "foundation-login" */
    '@genesislcap/foundation-login'
    );
  configure(container, {
    hostPath: 'login',
    autoConnect: true,
    defaultRedirectUrl: '{{kebabCase routes.[0].name}}',
    ...ssoSettings,
  });
  return define({
    name: `{{rootElement}}-login`,
    template: template(loginTemplateOptions),
    styles: styles(loginTemplateOptions),
  });
};
