// Set the appHostURL from which the providers are to be fetched.
const appHostURL = `https://${location.host}/gwf/`;

const inIFrame = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

const inSymphonyDesktop = () => {
  const userAgent = navigator?.userAgent;
  return userAgent?.includes('Symphony') && userAgent?.includes('Electron');
};

const POPUP_DEFAULT_WIDTH = 483;
const POPUP_DEFAULT_HEIGHT = 600;

const openPopup = (
  urlNavigate,
  target,
  popUpWidth = POPUP_DEFAULT_WIDTH,
  popUpHeight = POPUP_DEFAULT_HEIGHT
) => {
  const left = window.innerWidth / 2 - popUpWidth / 2 + window.screenX;
  const top = window.innerHeight / 2 - popUpHeight / 2 + window.screenY;

  const popupWindow = window.open(
    urlNavigate,
    target,
    'width=' +
      popUpWidth +
      ', height=' +
      popUpHeight +
      ', top=' +
      top +
      ', left=' +
      left +
      ', scrollbars=yes'
  );
  if (popupWindow.focus) {
    popupWindow.focus();
  }

  return popupWindow;
};

const fetchIDPs = async () => {
  const ipdsEndpoint = `${appHostURL}sso/list`;
  return fetch(ipdsEndpoint)
    .then((res) => {
      if (res.ok) return res;
      throw new Error(res.statusText);
    })
    .then((res) => res.json())
    .then((json) => json.IDPS)
    .catch(() => {
      logger.error('Failed to fetch identity providers.');
      return [{ ID: 'error', DESCRIPTION: 'Failed to fetch providers.' }];
    });
};


// If we do not have initSSO token in our sessionStorage, 
// then we check the list of providers and get ssoToken
if (!sessionStorage.getItem('initSSO')) {
  fetchIDPs().then((allIdps) => {
    console.log('fetched IDPs', allIdps);
    idps = allIdps.map((idp) => ({
      id: idp.ID,
      type: idp.TYPE,
    }));


    // Set initSSO token in sessionStorage after the first fetch of providers
    sessionStorage.setItem('initSSO', 'true');

    // If your environment has more providers and you want to test it - set a number corresponding to the number of your providers
    if (idps.length == 1) {
      const ssoLoginRoute = `/gwf/${idps[0].type}/login`;
      const ssoLoginUrl = `https://${new URL(appHostURL).host}${ssoLoginRoute}?idp=${idps[0].id}`;

      if (inIFrame()) {
        if (inSymphonyDesktop()) {
          // symphony/electron opens new window in the default browser instead
          // popup within electron, so we have to navigate manually
          openPopup('', 'symphony').location.assign(ssoLoginUrl);
        } else {
          openPopup(ssoLoginUrl, 'Login');
        }
      } else {
        window.open(ssoLoginUrl, '_self');
      }
    }
  });
}

// If we have initSSO in our sessionStorage, then we load the entire application
function appendApp() {
  if (sessionStorage.getItem('initSSO')) {
    const node = document.createElement('blank-app');
    document.body.appendChild(node);
  }
}
