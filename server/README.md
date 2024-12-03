# Genesis Product Server

## Project structure

The blank-app-seed project has now been converted to a Simplified project structure and the old project structure is now referred to as Legacy.
The {{appName}}-app module is the server's main module and, as a minimum, is the only one required.
All of the project's server code can be put in this module including configuration files, GPAL scripts and other Java/Kotlin code.

By default, the main module will be detected by a module ending with -app. 
You can use the Genesis Gradle Settings plugin property `mainModuleName` to specify a custom name.
The Genesis Settings plugin is configured in server/settings.gradle.kts with the `genesis` extension.

For more details on project structures, see the [docs](https://docs.genesis.global/docs/build-deploy-operate/build/project-structure/).