#!/usr/bin/env bash
#
# Check what this seed emits for the MCP server (GENC-1615), and what it does NOT.
#
# Everything the feature emits sits behind ONE gate, `data.MCP.enabled` in configure.js, decided by
# .genx/utils/mcpConfig.js. Every assertion here is a way that gate, or what it writes, could fail:
#
#   off       no ui.mcp, ui.mcp.enabled=false, and an mcp block with nothing it can expose each
#             generate the default app: no MCP script, no system-definition item, no README section.
#             A project that never asked for MCP must not change.
#   on        the exposure script holds one enableMcp per resource, in order, and nothing else live;
#             the server script is this GSF line's template with only the app name filled in, and its
#             live code is pinned here, so a changed setting fails even when the template changed
#             with it; the system definition carries START and SCRIPT exactly once each, SCRIPT
#             naming the server script that was written, and is otherwise the default app's; the
#             README gains its section and nothing else; docker-compose.yml publishes 3011 on the
#             host's loopback only, and only then. A web-components app gets the same server files:
#             MCP is server only.
#   dropped   an mcp block carrying entries that cannot be emitted as they are comes out as its clean
#             form, and the log names each one: a REQ_ name, a lower-case name, a name too long for
#             its read tool, an event (on 8.15 a write would have no approval step), a repeated name,
#             and a context that is empty or holds a character that would need escaping: a quote, a
#             $, a backslash, a { or one Handlebars turns into an entity (' & =). The fixture's own
#             contexts use every other character the alphabet allows, so a narrowed one fails "on".
#   line      a GSF line this seed declares no template for emits nothing and says so. Every
#             declared line has a template, every template a declared line, this seed's own line is
#             declared, and 8.15 declares reads only.
#   safe      no MCP script in any generated app names a strategy that does not check the caller,
#             sets requiresAuth to false, or uses a setting 8.15 does not have.
#
# Usage:  .genx/scripts/check-mcp-emission.sh
# Env:    GRADLE=1  also compile the MCP app's two scripts with the platform's preCompileScripts. A
#                   script that does not compile fails a customer's whole prepare, not only MCP, so
#                   a template that stops compiling against this Genesis version must fail here.
#                   Needs Genesis artifactory credentials, as the sample-app build does.
#         GRADLE_PARAMS=...  extra arguments for every gradle call (CI passes -PuseDevRepo=true on
#                   prerelease).
#         SEED=...  the seed to check (default: this checkout). Mutation runs point it at a copy.
#         KEEP=1    keep the generated apps for inspection.
#         GENX=...  the genx package to generate with (default: a pinned version, so a run is
#                   reproducible).

set -uo pipefail

SEED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC="${SEED:-$SEED_DIR}"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/blank-app-seed-mcp.XXXXXXXX")" || exit 1
MODULE="server/demo-app/src/main/genesis"
FAILURES=()
GENX="${GENX:-@genesislcap/genx@15.35.1}"

MCP_UI="$(cat "$SRC/.genx/tests/fixtures/mcp-config.json")"
# The fixture with every entry the writer must drop, interleaved. It must come out as the fixture.
MCP_UI_DROPPED="$(node -e '
const u = JSON.parse(process.argv[1]);
const [trade, position] = u.mcp.resources;
const ok = "Reads rows.";
u.mcp.resources = [
  { name: "REQ_TRADE", kind: "request", context: ok },
  trade,
  { name: "trade", kind: "request", context: ok },
  { name: "T".repeat(59), kind: "request", context: ok },
  { name: "EVENT_TRADE_INSERT", kind: "event", context: ok },
  { ...trade, context: "A second TRADE." },
  { name: "QUOTED", kind: "request", context: "Reads \"quoted\" rows." },
  { name: "DOLLAR", kind: "request", context: "Reads ${x} rows." },
  { name: "BACKSLASH", kind: "request", context: "Reads a\\b rows." },
  { name: "BRACE", kind: "request", context: "Reads {rows}." },
  { name: "APOSTROPHE", kind: "request", context: "Reads the app" + String.fromCharCode(39) + "s rows." },
  { name: "AMPERSAND", kind: "request", context: "Reads buys & sells." },
  { name: "EQUALS", kind: "request", context: "Reads rows where side = BUY." },
  { name: "NO_CONTEXT", kind: "request" },
  position,
];
console.log(JSON.stringify(u));' "$MCP_UI")"
# The names the log must report as dropped from MCP_UI_DROPPED, each with a word of its reason.
DROPPED_EXPECTED=(
  'REQ_TRADE — a request is named by its bare name'
  'trade — its name is not a platform name'
  "$(printf 'T%.0s' $(seq 1 59)) — its name is longer than the 58"
  'EVENT_TRADE_INSERT — kind event is not exposed on GSF 8.15'
  'TRADE — it is named twice'
  'QUOTED — its context'
  'DOLLAR — its context'
  'BACKSLASH — its context'
  'BRACE — its context'
  'APOSTROPHE — its context'
  'AMPERSAND — its context'
  'EQUALS — its context'
  'NO_CONTEXT — its context'
)
MCP_UI_OFF="$(node -e 'const u = JSON.parse(process.argv[1]); u.mcp.enabled = false; console.log(JSON.stringify(u))' "$MCP_UI")"
MCP_UI_EMPTY='{"mcp":{"enabled":true,"resources":[{"name":"REQ_TRADE","kind":"request","context":"Reads rows."}]}}'

fail() { FAILURES+=("$1"); echo "FAIL: $1"; }

generate() {
  local label="$1"; shift
  mkdir -p "$WORK_DIR/$label"
  (cd "$WORK_DIR/$label" && npx -y "$GENX" init demo -s "${GEN_SEED:-$SRC}" -x --no-shell \
    --apiHost 'wss://localhost/gwf/' "$@" > "$WORK_DIR/$label.log" 2>&1) \
    || { fail "$label: generation failed (see $WORK_DIR/$label.log)"; return 1; }
  # genx logs a file it cannot render and ships it unrendered, so a broken {{#if}} passes generation.
  if grep -q 'Error interpolating variables' "$WORK_DIR/$label.log"; then
    fail "$label: genx could not render a file and shipped it unrendered: $(grep -o 'Error interpolating variables in [^ ]*' "$WORK_DIR/$label.log" | head -3 | tr '\n' ' ')"
  fi
}

# A copy of the seed on a GSF line it declares no MCP server for.
LINE_SEED="$WORK_DIR/seed-9.99"
mkdir -p "$LINE_SEED"
(cd "$SRC" && tar -cf - --exclude .git --exclude node_modules .) | (cd "$LINE_SEED" && tar -xf -)
node -e '
const fs = require("fs");
const file = process.argv[1];
const versions = JSON.parse(fs.readFileSync(file, "utf8"));
versions.GSF = "9.99.0";
fs.writeFileSync(file, JSON.stringify(versions, null, 2) + "\n");' "$LINE_SEED/.genx/versions.json"

echo "=== generating apps"
generate default --framework react
generate defaultwc --framework webcomponents
generate off --framework react --ui "$MCP_UI_OFF"
generate empty --framework react --ui "$MCP_UI_EMPTY"
generate on --framework react --ui "$MCP_UI"
generate dropped --framework react --ui "$MCP_UI_DROPPED"
generate webcomponents --framework webcomponents --ui "$MCP_UI"
GEN_SEED="$LINE_SEED" generate linedefault --framework react
GEN_SEED="$LINE_SEED" generate line --framework react --ui "$MCP_UI"

echo "=== off: apps that did not ask for MCP, or could not have it, are the default app"
# .genx/answers.json records the prompt answers, the generator's data and a timestamp, so it differs
# between any two runs; everything else must be byte for byte the same.
# The line app is compared with the default app of its own seed copy, which differs in its GSF version.
for pair in default:off default:empty linedefault:line; do
  base="${pair%%:*}"; label="${pair##*:}"
  diff -r -x node_modules -x answers.json "$WORK_DIR/$base/demo" "$WORK_DIR/$label/demo" > "$WORK_DIR/$label.diff" \
    || fail "$label: differs from the $base app (see $WORK_DIR/$label.diff)"
done
grep -q 'mcp: not emitted — there is no resource to expose' "$WORK_DIR/empty.log" \
  || fail "empty: the log does not say there was nothing to expose"
grep -q 'mcp: not emitted — this seed has no MCP server for GSF 9.99.0' "$WORK_DIR/line.log" \
  || fail "line: the log does not say there is no MCP server for GSF 9.99.0"

echo "=== dropped: what cannot be emitted is dropped, and said"
for expected in "${DROPPED_EXPECTED[@]}"; do
  grep -qF "mcp: dropped resource $expected" "$WORK_DIR/dropped.log" \
    || fail "dropped: the log does not report 'mcp: dropped resource $expected'"
done
[ "$(grep -c 'mcp: dropped resource' "$WORK_DIR/dropped.log")" = "${#DROPPED_EXPECTED[@]}" ] \
  || fail "dropped: expected ${#DROPPED_EXPECTED[@]} dropped resources in the log, found $(grep -c 'mcp: dropped resource' "$WORK_DIR/dropped.log")"

echo "=== on, dropped, webcomponents, line, safe"
node - "$WORK_DIR" "$MODULE" "$SRC" "$MCP_UI" <<'NODE' || fail "the checks above (see their lines)"
const fs = require('fs');
const path = require('path');
const [workDir, module, src, uiJson] = process.argv.slice(2);
const problems = [];
const app = (label) => path.join(workDir, label, 'demo');
const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null);
// Live code: comments removed, trailing space trimmed, blank lines dropped.
const live = (text) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, '').replace(/\s+$/, ''))
    .filter(Boolean);
const files = (label) => ({
  exposure: path.join(app(label), module, 'scripts/demo-mcp.kts'),
  server: path.join(app(label), module, 'scripts/demo-mcp-server.kts'),
  sysdef: path.join(app(label), module, 'cfg/genesis-system-definition.kts'),
  readme: path.join(app(label), 'README.md'),
  compose: path.join(app(label), 'docker-compose.yml'),
});
const resources = JSON.parse(uiJson).mcp.resources;

// Each GSF line's server, as live code, pinned here and not read from its template: a setting
// changed in a template must fail this, not move the expectation with it. A line the seed declares
// must have its entry here, so adding a line (GSF 10) cannot skip it.
const SERVERS = {
  '8.15': [
    'server {',
    '    port = 3011',
    '    serverName = "demo"',
    '    authenticationStrategy {',
    '        sessionAuthToken {',
    '            addToToolSpec = false',
    '        }',
    '    }',
    '}',
  ],
};
// What no MCP script may hold on any line, and what a line does not have at all.
const UNSAFE = [
  [/\bstaticUser\b/, 'the staticUser strategy, which runs every caller as one account'],
  [/\bprovidedUserName\b/, 'the providedUserName strategy, which trusts a typed user name'],
  [/\brequiresAuth\s*=\s*false\b/, 'requiresAuth = false'],
];
const NOT_ON_LINE = {
  '8.15': [/\b(platformTools|requireAuthenticatedConnections|requireApprovalForWrites|approverRight|oidc)\b/, 'a setting GSF 8.15 does not have'],
};
const ownLine = JSON.parse(read(path.join(src, '.genx/versions.json'))).GSF.split('.').slice(0, 2).join('.');
const EXPOSURE = [
  'mcp {',
  ...resources.flatMap(({ name, context }) => [
    `    enableMcp(resource = "${name}") {`,
    `        context = "${context}"`,
    '    }',
  ]),
  '}',
];
const MCP_ITEMS = [
  '        item(name = "GENESIS_MCP_PROCESS_START", value = "true")',
  '        item(name = "GENESIS_MCP_PROCESS_SCRIPT", value = "demo-mcp-server.kts")',
];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// The lines `changed` adds to and removes from `base`, between their common start and common end.
const inserted = (base, changed) => {
  const a = base.split('\n');
  const b = changed.split('\n');
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let end = 0;
  while (end < a.length - start && end < b.length - start && a[a.length - 1 - end] === b[b.length - 1 - end]) end++;
  return { removed: a.slice(start, a.length - end), added: b.slice(start, b.length - end) };
};

const defaults = files('default');
const defaultSysdef = read(defaults.sysdef);
const defaultReadme = read(defaults.readme);
for (const [label, file] of Object.entries(defaults)) {
  if ((label === 'exposure' || label === 'server') && read(file) !== null) problems.push(`default: ${file} exists`);
}
if (/GENESIS_MCP/.test(defaultSysdef)) problems.push('default: the system definition mentions GENESIS_MCP');
if (/## MCP server/.test(defaultReadme)) problems.push('default: the README has an MCP section');
if (/3011/.test(read(defaults.compose))) problems.push('default: docker-compose.yml publishes 3011');
const COMPOSE_PORT = ["      - '127.0.0.1:3011:3011'"];

for (const label of ['on', 'dropped', 'webcomponents']) {
  const f = files(label);
  const exposure = read(f.exposure);
  const server = read(f.server);
  const sysdef = read(f.sysdef);
  const readme = read(f.readme);
  if (exposure === null || server === null) {
    problems.push(`${label}: an MCP script is missing`);
    continue;
  }
  if (!same(live(exposure), EXPOSURE)) problems.push(`${label}: the exposure script's live code is not one enableMcp per resource:\n${live(exposure).join('\n')}`);
  if (!same(live(server), SERVERS[ownLine])) problems.push(`${label}: the server script's live code is not the pinned ${ownLine} server:\n${live(server).join('\n')}`);
  const template = read(path.join(src, `.genx/templates/server/mcp/server-${ownLine}.kts.hbs`));
  if (server !== template.replace(/\{\{appName\}\}/g, 'demo')) problems.push(`${label}: the server script is not its template with the app name filled in`);
  // Exactly the two items, once each, and the system definition is otherwise the default app's.
  const mcpLines = sysdef.split('\n').filter((line) => line.includes('GENESIS_MCP_PROCESS_'));
  if (!same(mcpLines, MCP_ITEMS)) problems.push(`${label}: the system definition's MCP items are not START and SCRIPT once each:\n${mcpLines.join('\n')}`);
  const scriptNamed = /value = "([^"]+)"/.exec(mcpLines[1] || '')?.[1];
  if (!scriptNamed || !fs.existsSync(path.join(app(label), module, 'scripts', scriptNamed))) problems.push(`${label}: SCRIPT names ${scriptNamed}, which was not written`);
  // What changed against the default app: one block inserted, nothing removed.
  // Against the default app of the same framework.
  const base = files(label === 'webcomponents' ? 'defaultwc' : 'default');
  const sysdefChange = inserted(read(base.sysdef), sysdef);
  if (sysdefChange.removed.length || !same(sysdefChange.added.filter((line) => !/^\s*\/\//.test(line)), MCP_ITEMS)) {
    problems.push(`${label}: the system definition differs from the default app's in more than its two MCP items`);
  }
  // The MCP port is published on the host's loopback only: 8.15 has no connection-level authentication.
  const composeChange = inserted(read(base.compose), read(f.compose));
  if (composeChange.removed.length || !same(composeChange.added.filter((line) => !/^\s*#/.test(line)), COMPOSE_PORT)) {
    problems.push(`${label}: docker-compose.yml differs from the default app's in more than the loopback MCP port:\n${composeChange.added.join('\n')}`);
  }
  const readmeChange = inserted(read(base.readme), readme);
  if (readmeChange.removed.length || !readmeChange.added.includes('## MCP server')) {
    problems.push(`${label}: the README differs from the default app's in more than an MCP section`);
  } else if (/\{\{|\}\}/.test(readmeChange.added.join('\n'))) {
    problems.push(`${label}: the README's MCP section holds unrendered Handlebars`);
  }
}

// dropped comes out as on.
for (const name of ['demo-mcp.kts', 'demo-mcp-server.kts']) {
  const on = read(path.join(app('on'), module, 'scripts', name));
  const dropped = read(path.join(app('dropped'), module, 'scripts', name));
  if (on !== dropped) problems.push(`dropped: ${name} is not the clean fixture's`);
}

// line: the declaration and the templates agree, and include this seed's own line.
const declaration = JSON.parse(read(path.join(src, '.genx/mcp-consumer.json')));
const lines = Object.keys(declaration.gsfLines);
const templateDir = path.join(src, '.genx/templates/server/mcp');
const templated = fs.readdirSync(templateDir).map((f) => /^server-(.+)\.kts\.hbs$/.exec(f)?.[1]).filter(Boolean);
for (const line of lines) if (!templated.includes(line)) problems.push(`line: GSF ${line} is declared but has no server template`);
for (const line of templated) if (!lines.includes(line)) problems.push(`line: server-${line}.kts.hbs has no declared GSF line`);
if (!lines.includes(ownLine)) problems.push(`line: this seed's own GSF line ${ownLine} is not declared`);
for (const line of lines) if (!SERVERS[line]) problems.push(`line: GSF ${line} is declared but this check pins no server for it`);
if (!same(declaration.gsfLines['8.15']?.kinds, ['request'])) problems.push(`line: GSF 8.15 must declare reads only, not ${JSON.stringify(declaration.gsfLines['8.15']?.kinds)}`);

// safe: every MCP script in every app.
for (const label of fs.readdirSync(workDir)) {
  const scripts = path.join(workDir, label, 'demo', module, 'scripts');
  if (!fs.existsSync(scripts)) continue;
  for (const name of fs.readdirSync(scripts).filter((n) => /-mcp(-server)?\.kts$/.test(n))) {
    const code = live(read(path.join(scripts, name))).join('\n');
    const line = label === 'line' ? null : ownLine;
    for (const [pattern, what] of [...UNSAFE, ...(NOT_ON_LINE[line] ? [NOT_ON_LINE[line]] : [])]) {
      if (pattern.test(code)) problems.push(`safe: ${label}/${name} uses ${what}`);
    }
  }
}

problems.forEach((p) => console.log(`    ${p}`));
process.exit(problems.length ? 1 : 0);
NODE

if [ "${GRADLE:-0}" = "1" ]; then
  # A CI runner's temporary files are gone once the job ends, so a failing step prints its own log.
  show_log() {
    echo "--- errors in $1"; grep -E ' ERROR |^e: |What went wrong' "$1" | head -n 40
    echo "--- last 150 lines of $1"; tail -n 150 "$1"; echo "---"
  }
  echo "=== gradle: compile the MCP app's two scripts with the platform's preCompileScripts"
  # Unquoted on purpose: GRADLE_PARAMS may hold several arguments, or none.
  (cd "$WORK_DIR/on/demo" && ./gradlew --no-daemon ${GRADLE_PARAMS:-} :server:demo-app:preCompileScripts --rerun \
    -PfailPreCompileScriptOnErrors=true > "$WORK_DIR/compile.log" 2>&1) \
    || { show_log "$WORK_DIR/compile.log"; fail "gradle: an MCP script does not compile against this Genesis version (see the log above)"; }
  # The MCP process runs this app's script, not the platform's default (another port, one fixed user),
  # which is what the SCRIPT item is for; and both scripts were really compiled, since a script the
  # task never picked up would pass by never being built.
  grep -qF "PreCompileScripts-GENESIS_MCP: Running with file names: [demo-mcp-server.kts]" "$WORK_DIR/compile.log" \
    || fail "gradle: the MCP process does not run demo-mcp-server.kts"
  for name in demo-mcp-server.kts demo-mcp.kts; do
    grep -q "GENESIS_MCP: Compiled script $name " "$WORK_DIR/compile.log" \
      || fail "gradle: preCompileScripts never compiled $name"
  done
fi

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  echo "FAILED:"; printf ' - %s\n' "${FAILURES[@]}"
  echo "Generated apps kept in $WORK_DIR"
  exit 1
fi
echo "MCP emission checks passed${GRADLE:+ (with gradle)}"
[ "${KEEP:-0}" = "1" ] && echo "Generated apps kept in $WORK_DIR" || rm -rf "$WORK_DIR"
