import { createBrowserHistory, History } from 'history';

export type Router = History;

export const history = createBrowserHistory() as History;
