# Web Client

## Frontend stack

Genesis components are standards-based Web Components, making them compatible with almost any modern web framework.

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

## Styling

Genesis components are registered with a Design System,
and the default system is named `rapid`. The design system is driven by the theme file `src/styles/default.theme.json`:
tokens under `shared` (colours, typography, sizing) apply to every mode, while the `modes` section declares the
available modes (`light` and `dark` by default) with their per-mode tokens.

`src/styles/active-theme.ts` loads the theme file and exposes it as the app's active theme. It is the single source of
truth used to inject the theme styles and apply the initial mode at startup (`src/main/main.ts`), and to decide whether
the header shows the light/dark toggle (`src/layouts/default.ts`).

The toggle appears automatically when the theme declares more than one mode (set `showModeToggle` in the theme file to
override this). Clicking it cycles through the declared modes, and the selected mode is remembered across reloads.

