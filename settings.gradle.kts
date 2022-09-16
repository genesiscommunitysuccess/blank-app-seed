rootProject.name = "{{appName}}"

// servers
includeBuild("server/jvm") {
    name = "genesisproduct-{{appName}}"
}

// clients
includeBuild("client")

pluginManagement {
    repositories {
        gradlePluginPortal()
        maven {
            url = uri("https://genesisglobal.jfrog.io/genesisglobal/dev-repo")
            credentials {
                username = extra.properties["genesisArtifactoryUser"].toString()
                password = extra.properties["genesisArtifactoryPassword"].toString()
            }
        }
    }
}
