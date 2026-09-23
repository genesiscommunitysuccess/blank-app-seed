# {{appName}}

{{{description}}}
{{#if AI.enabled}}

## AI chat

This application includes an AI chat panel. It talks to **your** AI vendor with **your** key —
nothing is routed through Genesis, and no key is stored in this project.

**Set your key where the server starts, not in a file here.** A system-definition item can be
supplied entirely from the environment, so pick the vendor you use and set one of:

```
GENESIS_SYSDEF_AI_ANTHROPIC_API_KEY=sk-ant-...
GENESIS_SYSDEF_AI_GEMINI_API_KEY=...
```

with `docker run -e` or an `environment:` entry in compose.
Restart the server afterwards — items are read once at boot.

**Grant the right.** Calling the chat endpoint needs the `AI_CHAT` right. Give it to the users
who should see the chat the way you grant any other Genesis right, through a profile.

**Bound what it can do.** `AI_ALLOWED_MODELS` limits which models may be requested and
`AI_MAX_OUTPUT_TOKENS` caps the output size of a single call. Both live in
`server/{{appName}}-app/src/main/genesis/cfg/genesis-ai-system-definition.kts`, and both can be overridden from the
environment in the same way as the key. With no key configured the endpoint answers **424**, so a
panel reporting a missing key is telling you exactly what it needs.
{{/if}}

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

# Getting started with development

## Next steps

If you need an introduction to the Genesis platform and its modules it's worth heading [here](https://docs.genesis.global/docs/develop/platform-overview/).

## Project Structure

This project has been created from the Genesis Blank Application Seed. Our seeds allow users to quickly bootstrap
their projects. Each seed adheres to strict Genesis best practices, and has passed numerous performance, compliance and
accessibility checks.

This project contains **server** and **client** directories which contain the server and client code respectively.

### Server

The server code for this project can be found [here](./server/README.md).
It is built using a DSL-like definition based on the Kotlin language: GPAL.

When first opening the project, if you receive a notification from IntelliJ IDE detecting Gradle project select the option to 'Load as gradle project'.

### Web client

The Web client for this project can be found [here](./client/README.md). It is built using Genesis's next
generation web development framework, which is based on Web Components.

# License

This is free and unencumbered software released into the public domain. For full terms, see [LICENSE](./LICENSE)

**NOTE** This project uses licensed components listed in the next section, thus licenses for those components are required during development.

## Licensed components
Genesis application platform
