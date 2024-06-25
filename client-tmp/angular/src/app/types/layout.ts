import { layoutComponentName } from '../app.config';

export type LayoutComponentName =
  | typeof layoutComponentName.default
  | typeof layoutComponentName.blank;
