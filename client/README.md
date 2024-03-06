# Web Client

## Frontend stack

Genesis components are standards-based Web Components, making them compatible with almost any modern web framework.
Our state-of-the-art design system and component set is built on top of
[Microsoft FAST](https://www.fast.design/docs/introduction/).

# Development

1. Install dependencies:

```shell
npm run bootstrap
```

2. Start Web development server in watch mode:

```shell
npm run dev
```

3. Build for production:

```shell
npm run build
```

Preview production build:

```shell
npm run serve
```

## Clean

Remove distribution and node_modules directories:

```shell
npm run clean
```

Baseline task combines `clean` and `bootstrap` tasks into a single command:

```shell
npm run baseline
```

## Review Notes

An `overrides` object has been added to package.json to support pre-releases of foundation and PBC packages. 

For example if the PBC source repos have peerDependencies defined like these:

```json
"peerDependencies": {
  "@genesislcap/foundation-entity-management": "~14",
  "@genesislcap/foundation-layout": "~14",
  "@genesislcap/foundation-logger": "~14",
  "@genesislcap/foundation-ui": "~14",
  "@genesislcap/foundation-zero": "~14"
}
```

Yet the PBC metadata repo and `blank-app-seed` are being run against a pre-release version of foundation,
like `14.127.6-pbc-demo.4`, then the npm install will fail with an `unable to resolve dependency tree` error.

Defining `overrides` here in the `blank-app-seed` addresses the problem for now, but in principle it should work without.
