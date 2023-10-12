rootProject.name = "genesisproduct-{{appName}}"

buildCache {
    local {
        directory = File(rootDir.parentFile.parent, "build-cache")
        removeUnusedEntriesAfterDays = 30
        isEnabled = true
    }
}

pluginManagement {
    pluginManagement {
        val genesisVersion: String by settings
        val deployPluginVersion: String by settings
        plugins {
            id("global.genesis.build") version genesisVersion
            id("global.genesis.deploy") version deployPluginVersion
        }
    }
    repositories {
        mavenLocal {
            // VERY IMPORTANT!!! EXCLUDE AGRONA AS IT IS A POM DEPENDENCY AND DOES NOT PLAY NICELY WITH MAVEN LOCAL!
            content {
                excludeGroup("org.agrona")
            }
        }
        mavenCentral()
        gradlePluginPortal()
        maven {
            val repoUrl = if(extra.properties["clientSpecific"] == "true") {
                "https://genesisglobal.jfrog.io/genesisglobal/libs-release-client"
            } else {
                "https://genesisglobal.jfrog.io/genesisglobal/dev-repo"
            }
            url = uri(repoUrl)
            credentials {
                username = extra.properties["genesisArtifactoryUser"].toString()
                password = extra.properties["genesisArtifactoryPassword"].toString()
            }
        }
    }
}



include("{{appName}}-config")
include("{{appName}}-messages")
include("{{appName}}-eventhandler")
include("{{appName}}-script-config")
include("{{appName}}-distribution")
include("{{appName}}-dictionary-cache")
include("{{appName}}-dictionary-cache:{{appName}}-generated-sysdef")
include("{{appName}}-dictionary-cache:{{appName}}-generated-fields")
include("{{appName}}-dictionary-cache:{{appName}}-generated-dao")
include("{{appName}}-dictionary-cache:{{appName}}-generated-hft")
include("{{appName}}-dictionary-cache:{{appName}}-generated-view")
include("{{appName}}-deploy")
include("{{appName}}-site-specific")

includeBuild("../../client")
