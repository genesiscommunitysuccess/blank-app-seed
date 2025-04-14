pluginManagement {
    val genesisVersion: String by settings
    val startVersion: String by settings

    plugins {
        id("global.genesis.settings") version genesisVersion
        id("global.genesis.genesis-start-gui") version startVersion
    }

    repositories {
        mavenCentral()
        gradlePluginPortal()
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
            // VERY IMPORTANT!!! EXCLUDE AGRONA AS IT IS A POM DEPENDENCY AND DOES NOT PLAY NICELY WITH MAVEN LOCAL!
            content {
                excludeGroup("org.agrona")
            }
        }
        google()
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

