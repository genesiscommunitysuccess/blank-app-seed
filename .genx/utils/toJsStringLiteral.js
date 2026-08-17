/**
 * Renders a value as a JS/TS string literal, quotes included, in the exact shape
 * oxfmt (`singleQuote: true`, prettier semantics) would print it — so generated
 * code passes `oxfmt --check` without a reformat pass.
 *
 * Two things have to be right:
 *
 * 1. Escaping. Naively escaping only apostrophes breaks on backslashes
 *    (`back\` swallows the closing quote) and on newlines/tabs/control
 *    characters (an unterminated literal). `JSON.stringify` already escapes
 *    `\`, `"` and every control character exactly the way oxfmt prints them.
 * 2. Quote choice. oxfmt prefers single quotes but flips to double quotes when
 *    the content contains strictly more apostrophes than double quotes (fewer
 *    escapes wins). Emitting `'Trader\'s Book'` would therefore be rewritten to
 *    `"Trader's Book"` by oxfmt and fail `--check`.
 *
 * @param {unknown} value value to render (coerced with String())
 * @returns {string} the literal, including its enclosing quotes
 */
const toJsStringLiteral = (value) => {
  const str = String(value);
  const singleQuotes = (str.match(/'/g) || []).length;
  const doubleQuotes = (str.match(/"/g) || []).length;

  // JSON escaping, minus the enclosing double quotes.
  const jsonBody = JSON.stringify(str).slice(1, -1);

  if (singleQuotes > doubleQuotes) return `"${jsonBody}"`;

  // Re-target the escaping at apostrophes: in a JSON body every `"` is escaped
  // and every `'` is not, which is the mirror image of what a single-quoted
  // literal needs.
  const body = jsonBody.replace(/\\"/g, '"').replace(/'/g, "\\'");
  return `'${body}'`;
};

module.exports = toJsStringLiteral;
