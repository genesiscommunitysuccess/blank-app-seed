const fs = require('fs');
const path = require('path');

/**
 * The GSF lines this seed can give an MCP server, and what each line exposes. Create reads the same
 * file to decide whether to ask for one, so a line is declared only once its server template exists.
 */
const declaration = require('../mcp-consumer.json');

/** A platform name, upper snake. A request server is named by its BARE name: `TRADE`, never `REQ_TRADE`. */
const PLATFORM_NAME = /^[A-Z0-9_]+$/;

/** The read tool is the name lowercased plus `_query`, and MCP clients refuse tool names over 64. */
const MAX_NAME_LENGTH = 64 - '_query'.length;

/**
 * What a context may hold. The script writes it into a Kotlin string literal, and Handlebars renders
 * every .kts once more after this, so it must need no escaping in either (contract C-16.6).
 */
const CONTEXT = /^[A-Za-z0-9_ ,.;]+$/;

/** `8.15.14` → `8.15`; `10.0.0-beta4` → `10.0`. */
const gsfLine = (version) => String(version || '').split('.').slice(0, 2).join('.');

/**
 * This GSF line's server template. Resolved where it is used, never kept in `data`: genx persists
 * `data` into the app's .genx/answers.json, and an absolute path on the generating machine has no
 * business in a customer's project.
 */
const mcpServerTemplate = (line) => path.resolve(__dirname, `../templates/server/mcp/server-${line}.kts.hbs`);

const OFF = Object.freeze({ enabled: false, line: null, resources: [] });

/**
 * The MCP server's settings for this app, from the `mcp` block Create passes in ui.config.
 *
 * Fails closed. With no server template for this app's GSF line it emits nothing: a script written
 * for another line either fails to compile or, on a later line, runs with that line's unsafe defaults.
 * A resource the line does not expose, or one whose name or context could not be emitted as it is,
 * is dropped and said, and the rest are kept. A repeated name keeps its first entry, because the
 * platform refuses the whole script over one repeat. With nothing left to expose, nothing is emitted.
 *
 * @param {object} [mcp] - `ui.config.mcp`: `{ enabled, resources: [{ name, kind, context }] }`
 * @param {string} gsfVersion - this app's GSF version
 * @param {(message: string) => void} [warn]
 */
function mcpConfig(mcp, gsfVersion, warn = console.warn) {
  if (!mcp || mcp.enabled !== true) return OFF;
  const line = gsfLine(gsfVersion);
  const exposed = declaration.gsfLines[line];
  if (!exposed || !fs.existsSync(mcpServerTemplate(line))) {
    warn(`mcp: not emitted — this seed has no MCP server for GSF ${gsfVersion}`);
    return OFF;
  }
  const kept = [];
  const seen = new Set();
  for (const resource of Array.isArray(mcp.resources) ? mcp.resources : []) {
    const { name, kind, context } = resource && typeof resource === 'object' ? resource : {};
    const problem = !exposed.kinds.includes(kind)
      ? `kind ${kind} is not exposed on GSF ${line}`
      : typeof name !== 'string' || !PLATFORM_NAME.test(name)
        ? 'its name is not a platform name'
        : name.startsWith('REQ_')
          ? 'a request is named by its bare name, without REQ_'
          : name.length > MAX_NAME_LENGTH
            ? `its name is longer than the ${MAX_NAME_LENGTH} characters a read tool name allows`
            : seen.has(name)
              ? 'it is named twice, and one repeated name stops the whole MCP server'
              : typeof context !== 'string' || !CONTEXT.test(context)
                ? 'its context is empty or holds something other than letters, digits and _ , . ;'
                : null;
    if (problem) {
      warn(`mcp: dropped resource ${String(name)} — ${problem}`);
      continue;
    }
    seen.add(name);
    kept.push({ name, context });
  }
  if (kept.length === 0) {
    warn('mcp: not emitted — there is no resource to expose');
    return OFF;
  }
  return { enabled: true, line, resources: kept };
}

module.exports = { mcpConfig, mcpServerTemplate };
