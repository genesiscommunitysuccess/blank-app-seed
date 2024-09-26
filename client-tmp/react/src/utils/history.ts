import { createBrowserHistory, BrowserHistory } from 'history';

export type Router = BrowserHistory

export const history: Router = createBrowserHistory();
