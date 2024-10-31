
# {{capitalCase appName}}

This project is built with React.

## Install dependencies:

```shell
npm run bootstrap
```

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:3000/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests via [Jest](https://jestjs.io/docs/getting-started).

## Running end-to-end tests

Run `npm run test:e2e` to execute the end-to-end tests.

## Linting

Run `npm run lint` to lint the project.

## NPM Scripts

- `npm run baseline`: Cleans the project and installs dependencies.
- `npm run bootstrap`: Installs dependencies without auditing or funding checks.
- `npm run bootstrap:ci`: Installs dependencies in CI environment without auditing or funding checks.
- `npm run build`: Builds the project in production configuration.
- `npm run build:stats`: Builds the project and generates a stats JSON file.
- `npm run clean`: Cleans the `dist` and `node_modules` directories.
- `npm run dev`: Serves the project in development mode.
- `npm run dev:vite`: Serves the project in development mode (specific for vite configuration).
- `npm run dev:docker`: Serves the project in development mode, accessible from any network interface.
- `npm run dev:no-open`: Serves the project in development mode without automatically opening the browser.
- `npm run dev:intellij`: Serves the project in development mode (specific for IntelliJ).
- `npm run dev:https`: Serves the project in development mode with HTTPS.
- `npm run dsconfig`: Configures design system based on `src/styles/design-tokens.json`.
- `npm run lint`: Lints the project using the specified profile.
- `npm run lint:fix`: Fixes linting errors in the project.
- `npm run lint:eslint`: Lints the project using ESLint and the specified profile.
- `npm run lint:stylelint`: Lints CSS using a custom script.
- `npm run test`: Runs unit tests.
- `npm run test:e2e`: Runs end-to-end tests.
- `npm run test:e2e:debug`: Runs end-to-end tests in debug mode.
- `npm run test:e2e:ui`: Runs end-to-end tests in interactive mode.
- `npm run test:coverage`: Runs unit tests and generates a code coverage report.
- `npm run test:unit:watch`: Runs unit tests in watch mode.

## Further help

To get more help on React, check out the [React documentation](https://reactjs.org/docs/getting-started.html).
