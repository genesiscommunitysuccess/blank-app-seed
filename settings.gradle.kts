rootProject.name = "{{appName}}"

// servers
includeBuild("server/jvm") {
    name = "genesisproduct-{{appName}}"
}

// clients
includeBuild("client")

buildCache {
    local {
        directory = File(rootDir, "build-cache")
        removeUnusedEntriesAfterDays = 30
        isEnabled = true
    }
}

pluginManagement {
    repositories {
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
