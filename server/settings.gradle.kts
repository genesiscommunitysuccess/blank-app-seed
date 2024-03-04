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
            val repoUrl = if(properties["clientSpecific"] == "true") {
                "https://genesisglobal.jfrog.io/genesisglobal/libs-release-client"
            } else {
                "https://genesisglobal.jfrog.io/genesisglobal/dev-repo"
            }
            url = uri(repoUrl)
            credentials {
                username = properties["genesisArtifactoryUser"].toString()
                password = properties["genesisArtifactoryPassword"].toString()
            }
            content {
                fun disableIfTrue(
                    property: String,
                    moduleRegex: String,
                ) {
                    if (extra.properties[property] == "true") excludeModuleByRegex("global.genesis", moduleRegex)
                }

                disableIfTrue("localGenesis", "genesis-(?!crowley)[\\w-]+")
                disableIfTrue("localAuth", "auth-[\\w-]+")
                disableIfTrue("localFix", "fix-[\\w-]+")
                disableIfTrue("localMarketData", "market-data-[\\w-]+")
                disableIfTrue("localElektron", "elektron-[\\w-]+")
                disableIfTrue("localRefData", "ref_data_app-[\\w-]+")
                disableIfTrue("localDeployPlugin", "deploy-gradle-plugin")
                disableIfTrue("localCrowley", "genesis-crowley-[\\w-]+")
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
    projectType = APPLICATION

    dependencies {
        dependency("global.genesis:auth:${extra.properties["authVersion"]}")

    }

    plugins {
        genesisDeploy.enabled = {{ enableDeployPlugin }}
    }

}


include("{{appName}}-app")
