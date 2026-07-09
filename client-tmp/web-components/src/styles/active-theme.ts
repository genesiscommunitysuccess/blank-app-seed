import { isModeToggleEnabled, type ModalTheme } from '@genesislcap/rapid-design-system';
import themeJson from './default.theme.json';

export const activeTheme = themeJson as unknown as ModalTheme;

export const modeToggleEnabled = isModeToggleEnabled(activeTheme);
