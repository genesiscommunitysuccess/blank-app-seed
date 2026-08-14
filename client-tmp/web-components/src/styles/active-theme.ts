import { isModeToggleEnabled, toModalTheme } from '@genesislcap/rapid-design-system';
import themeJson from './default.theme.json';

export const activeTheme = toModalTheme(themeJson);

export const modeToggleEnabled = isModeToggleEnabled(activeTheme);
