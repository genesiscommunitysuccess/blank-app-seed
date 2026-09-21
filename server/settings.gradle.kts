pluginManagement {
    val genesisVersion: String by settings
    val startVersion: String by settings

    plugins {
        id("global.genesis.settings") version genesisVersion
        id("global.genesis.genesis-start-gui") version startVersion
        id("global.genesis.test") version genesisVersion
    }

    repositories {
        mavenLocal {
            // Scoped to the PBC under test, which CI publishes into -Dmaven.repo.local; anything
            // else must come from Artifactory, never from a developer's local repository.
            content {
                includeGroupByRegex("global\\.genesis.*")
            }
        }
        maven {
            val repoUrl = if(extra.properties["useDevRepo"] == "true") {
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

plugins {
    id("global.genesis.settings")
}

genesis {
    productName = "{{appName}}"

    dependencies {
        dependency("global.genesis:auth:${extra.properties["authVersion"]}")

    }

    plugins {
        genesisDeploy.enabled = true
    }
}

include("{{appName}}-app")
includeBuild("../client")
