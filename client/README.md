# Clients

- [Web](./web/README.md)
- [Mobile](./web/README.md)
- [Desktop](./desktop/README.md)

## Frontend stack

Genesis components are standards-based Web Components, making them compatible with almost any modern web framework.
Our state-of-the-art design system and component set is built on top of
[Microsoft FAST](https://www.fast.design/docs/introduction/).
This repo is managed with [Lerna](https://github.com/lerna/lerna).

# Development

*Note that things are a bit of a moving target at the moment, so these steps may change.*

1. Bootstrap the packages, which installs all of their dependencies and links any cross-dependencies.

**You must to this at least once to get the top level client dependencies in place.**

```shell
npm run bootstrap
```

Passing `--ignore-scripts` to the bootstrap command will speed up the process as it will skip prepare steps. Use this 
script shortcut.

```shell
npm run bootstrap:ignore-scripts
```

2. To start the **[web client](./web/README.md)** in watch mode:

```shell
npm run client:web
```

This command will clean and bootstrap all the dependencies by topological order and start the application.

**If you get `Error: Cannot find module 'rimraf'` you need to remember to run bootstrap at least once before using the
`npm run client:web` shortcut.**

## Lerna add dependency examples

Please do not use npm to install or manage dependencies as it will cause problems with lerna. Unfortunately lerna can
only process one dependency at a time, so there is no command like `npm i package-a package-b package-c`.

```shell
# Install rxjs in all modules
lerna add rxjs

# Install rxjs in all modules in devDependencies
lerna add rxjs --dev

# Install rxjs in @{{kebabCase pkgScope}}/{{kebabCase pkgName}}-web-client only
lerna add rxjs --scope=@{{kebabCase pkgScope}}/{{kebabCase pkgName}}-web-client
```

## List produced packages

```shell
npm run list
```

## Perpare packages

```shell
npm run perpare
```

## Clean

Remove the node_modules directory from all packages (not the root).

```shell
npm run clean
```

After this you'll likely want to run bootstrap again.

```shell
npm run bootstrap
```

Clean the dist directory in all packages.

```shell
npm run clean:dist
```
