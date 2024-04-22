rootProject.name = "genesisproduct-{{appName}}"

pluginManagement {
    pluginManagement {
        val genesisVersion: String by settings

        plugins {
            id("global.genesis.settings") version genesisVersion
        }
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
    }
}

plugins {
    id("global.genesis.settings")
}

genesis {
    dependencies {
        dependency("global.genesis:auth:${extra.properties["authVersion"]}")

    }

    plugins {
        genesisDeploy.enabled = {{ enableDeployPlugin }}
    }

}


include("{{appName}}-app")
