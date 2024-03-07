# {{appName}}

This project has been created from the Genesis Blank Application Seed. Our seeds allow users to quickly bootstrap
their projects. Each seed adheres to strict Genesis best practices, and has passed numerous performance, compliance and
accessibility checks. 

{{!

# Testing

Quick test: 

```
npx -y @genesislcap/genx@latest init myapp -x
```

Test local version (assuming `blank-app-seed` exists in current folder): 

```
npx -y @genesislcap/genx@latest init myapp -x -s ./blank-app-seed
```

Customise prompt answers: 

```
npx -y @genesislcap/genx@latest init myapp
```

Enable SSO (use any API host which has SSO providers configured):

```
npx -y @genesislcap/genx@latest init myapp -x -s ./blank-app-seed --enableSSO --apiHost wss://prim-uat-internal.genesis.global/gwf/
```
}}

# Introduction

## Next Steps

To get a simple application running check the [Quick Start](https://learn.genesis.global/docs/getting-started/quick-start/) guide.

If you need an introduction to the Genesis platform and its modules it's worth heading [here](https://learn.genesis.global/docs/getting-started/learn-the-basics/simple-introduction/).


## Project Structure

This project contains **server/jvm** and **client** directories which contain the server and client code respectively.

### Server

The server code for this project can be found [here](./server/jvm/README.md).
It is built using a DSL-like definition based on the Kotlin language: GPAL.

### Web Client

The Web client for this project can be found [here](./client/README.md). It is built using Genesis's next
generation web development framework, which is based on Web Components. Our state-of-the-art design system and component
set is built on top of [Microsoft FAST](https://www.fast.design/docs/introduction/).

# License

This is free and unencumbered software released into the public domain. For full terms, see [LICENSE](./LICENSE)

**NOTE** This project uses licensed components listed in the next section, thus licenses for those components are required during development.

## Licensed components
Genesis low-code platform
