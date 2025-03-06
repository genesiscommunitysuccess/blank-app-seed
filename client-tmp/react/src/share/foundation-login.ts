import { configure, defaultAuthConfig } from '@genesislcap/foundation-auth/config';
import { getUser } from '@genesislcap/foundation-user';
import { AUTH_PATH } from '@/config';
import { GENESIS_SOCKET_URL } from '@genesislcap/foundation-utils';
import { Connect } from '@genesislcap/foundation-comms';
import { DI } from '@genesislcap/web-core';
import type { NavigateFunction } from 'react-router';

/**
 * Configure the micro frontend
 */
export const configureFoundationLogin = ({navigate}: { navigate: NavigateFunction}) => {
  const baseElement = document.querySelector('base');
  const basePath = baseElement?.getAttribute('href') || '';
  const connect = DI.getOrCreateDOMContainer().get(Connect);


  configure({
    name: 'client-app-login',
    omitRoutes: ['request-account', 'forgot-password'],
    fields: {
      ...defaultAuthConfig.fields,
      username: {
        ...defaultAuthConfig.fields.username,
      },
    },
    hostPath: basePath + AUTH_PATH,
    postLoginRedirect: async () => {
      const url = GENESIS_SOCKET_URL;
      await connect.connect(url);

      const redirectUrl = '/{{kebabCase routes.[0].name}}';
      navigate(redirectUrl);
    },
  })
}

