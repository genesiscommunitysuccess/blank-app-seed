pluginManagement {
    val bddVersion: String by settings

    plugins {
        id("global.genesis.bdd_automation") version bddVersion
    }

    repositories {
        gradlePluginPortal()
        mavenCentral()
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
        mavenLocal {
            content {
                excludeGroup("org.agrona")
            }
        }
    }
}

rootProject.name = "{{appName}}-bdd-tests"