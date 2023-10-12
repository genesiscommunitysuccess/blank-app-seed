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
