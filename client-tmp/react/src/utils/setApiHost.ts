import { API_DATA } from '../config';

export const setApiHost = () => {
    const { URL: apiHost } = API_DATA;
  
    if (apiHost && sessionStorage.getItem('hostUrl') === null) {
      sessionStorage.setItem('hostUrl', apiHost);
    }
  };