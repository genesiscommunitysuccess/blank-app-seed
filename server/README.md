# Genesis Product Server

## Project structure

The blank-app-seed project has now been converted to a Simplified project structure and the old project structure is now referred to as Legacy.
The {{appName}}-app module is the server's main module and, as a minimum, is the only one required.
All of the project's server code can be put in this module including configuration files, GPAL scripts and other Java/Kotlin code.

By default, the main module will be detected by a module ending with -app. 
You can use the Genesis Gradle Settings plugin property `mainModuleName` to specify a custom name.
The Genesis Settings plugin is configured in server/settings.gradle.kts with the `genesis` extension.

### What files go where?

For this example, let’s have our product named "position".

| Files                      | Location |
|----------------------------|----------|
| Project config files       | position-app/src/main/genesis/cfg/     |
| Project script files       | position-app/src/main/genesis/scripts/ |
| Site-specific config files | position-app/src/main/genesis/cfg/     |
| Site-specific script files | position-app/src/main/genesis/scripts/ |
| Other site-specific files  | position-app/src/main/genesis/         |

### Modules

In the Simplified structure some modules have been removed completely, others are now managed by the Settings plugin. 
We call these "internal modules". The internal modules are located in the root project’s (server) build folder "build/internal-modules". 
Developers should not amend the files inside those modules. Below provides more details on this:

| Module name | Where has it gone?                                                                                                                                                                                                                                                                                                                                                                             |
| --- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| -config | Hidden internal module. Your project’s config and script files will be copied to this module automatically. Your project build will create a -config.jar like the legacy structure does.                                                                                                                                                                                                       |
| -dictionary-cache | Hidden internal module. Contains generated code.                                                                                                                                                                                                                                                                                                                                               |
| -site-specific | Hidden internal module, but only for application projects. Non-project config and script files will be copied from your project to this module automatically. All folders and files in the main module's src/main/genesis folder, except cfg and scripts, will be copied to site-specific/src/main/resources. A site-specific distribution will be created, same as the Legacy structure does. |
| -distribution | Removed. The project’s distribution file will be located in the root project’s (server) build folder, "server/build/distributions".                                                                                                                                                                                                                                                            |
| -eventhandler | Removed.                                                                                                                                                                                                                                                                                                                                                                                       |
| -messages | Removed.                                                                                                                                                                                                                                                                                                                                                                                       |
| -script-config | Removed.                                                                                                                                                                                                                                                                                                                                                                                       |
| -deploy | Removed. The deploy plugin can optionally be enabled on the main module in the Settings plugin extension.                                                                                                                                                                                                                                                                                      |