/**
 * Flattens legacy nested customTokens (`{ ag: { row: { height: { $value: '28px' } } } }`)
 * to the modal theme's flat CSS custom property map (`{ '--ag-row-height': '28px' }`).
 * A leaf is an object carrying `$value`, or a plain scalar.
 */
const flattenCustomTokens = (customTokens, prefix = '') => {
  const flat = {};
  Object.entries(customTokens).forEach(([key, value]) => {
    const name = prefix ? `${prefix}-${key}` : key;
    if (value && typeof value === 'object') {
      if ('$value' in value) {
        flat[`--${name}`] = String(value.$value);
      } else {
        Object.assign(flat, flattenCustomTokens(value, name));
      }
    } else if (value !== undefined && value !== null) {
      flat[`--${name}`] = String(value);
    }
  });
  return flat;
};

/**
 * Converts a designTokens payload to the modal theme FORMAT.
 * - Already modal (has `modes`): returned verbatim.
 * - Legacy (`design_tokens` at the top level): converted to an adaptive modal theme —
 *   everything except the `mode` group becomes shared, both light and dark modes are
 *   defined, nested customTokens are flattened, and `header_logo`/`custom_fonts` are
 *   preserved as top-level keys.
 * - Anything else: returned verbatim.
 *
 * Not to be confused with `toModalTheme` from `@genesislcap/rapid-design-system`, which
 * VALIDATES an already-modal theme at app startup (and throws on legacy shapes); this
 * utility is the generation-time converter that produces that modal shape from legacy input.
 */
const toModalThemeFormat = (designTokens) => {
  if (designTokens.modes || !designTokens.design_tokens) {
    return designTokens;
  }

  const { mode, ...sharedDesignTokens } = designTokens.design_tokens;
  const theme = {
    id: 'default',
    colorStrategy: 'adaptive',
    defaultMode: mode?.luminance?.$value < 0.5 ? 'dark' : 'light',
  };
  if (designTokens.header_logo !== undefined) {
    theme.header_logo = designTokens.header_logo;
  }
  if (designTokens.custom_fonts !== undefined) {
    theme.custom_fonts = designTokens.custom_fonts;
  }
  theme.shared = {
    design_tokens: sharedDesignTokens,
  };
  if (designTokens.customTokens) {
    theme.shared.customTokens = flattenCustomTokens(designTokens.customTokens);
  }
  theme.modes = {
    light: {
      design_tokens: {
        mode: { luminance: { $value: 1, $type: 'number' } },
      },
    },
    dark: {
      design_tokens: {
        mode: { luminance: { $value: 0.23, $type: 'number' } },
      },
    },
  };
  return theme;
};

module.exports = toModalThemeFormat;
