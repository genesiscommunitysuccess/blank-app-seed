plugins {
    id("global.genesis.deploy") version "{{deployPluginVersion}}"
}

description = "{{appName}}-deploy"

dependencies {
    implementation(
        group = "global.genesis",
        name = "genesis-distribution",
        version = "{{genesisVersion}}",
        classifier = "bin",
        ext = "zip"
    )
    implementation(
        group = "global.genesis",
        name = "auth-distribution",
        version = "{{genesisVersion}}",
        classifier = "bin",
        ext = "zip"
    )

    api(project(":{{appName}}-distribution", "distribution"))
    api(project(":{{appName}}-eventhandler"))
    api(project(":{{appName}}-messages"))
    api(project(":{{appName}}-site-specific", "distribution"))
    // Add additional dependencies on other external distributions here
}