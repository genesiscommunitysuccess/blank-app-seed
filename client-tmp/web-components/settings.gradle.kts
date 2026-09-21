pluginManagement {
    repositories {
        if (providers.gradleProperty("useMavenLocal").orNull == "true") {
            mavenLocal()
        }
        maven {
            val repoUrl = if (extra.properties["useDevRepo"] == "true") {
                "https://genesisglobal.jfrog.io/genesisglobal/dev-repo"
            } else {
                "https://genesisglobal.jfrog.io/genesisglobal/libs-release-client"
            }
            url = uri(repoUrl)
            credentials {
                username = extra.properties["genesisArtifactoryUser"].toString()
                password = extra.properties["genesisArtifactoryPassword"].toString()
            }
        }
        gradlePluginPortal()
        mavenCentral()
    }
}

rootProject.name = "client"
