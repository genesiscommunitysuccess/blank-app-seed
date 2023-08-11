import { fetchIDPs, getSSOLoginURL } from '@genesislcap/foundation-login';

export const isSSOEnabled = () => typeof GENX_ENABLE_SSO !== 'undefined' && GENX_ENABLE_SSO === 'true';

const getSSOToken = async () => {
  await fetchIDPs().then((IDPS) => {
    console.log('Received IDPs', IDPS);
    // Set initSSO token in sessionStorage after the first fetch of providers
    sessionStorage.setItem('initSSO', 'true');

    // If your environment has more providers and you want to test it - set a number corresponding to the number of your providers
    if (IDPS.length === 1) {
      const SSO_LOGIN_URL = getSSOLoginURL(IDPS[0]);
      window.open(SSO_LOGIN_URL, '_self');
    }
  });
}

export const initSSO = async () => {
  // If SSO not enabled, skip fetching providers
  if (!isSSOEnabled()) {
    return true;
  }

  // If we do not have initSSO token in our sessionStorage,
  // then we check the list of providers and get ssoToken
  if (!sessionStorage.getItem('initSSO')) {
    await getSSOToken();
  }

  return true;
}
