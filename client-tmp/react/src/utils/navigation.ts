import { history } from './history';

export const navigateTo = (path: string): void => {
  history.push(path);
};
