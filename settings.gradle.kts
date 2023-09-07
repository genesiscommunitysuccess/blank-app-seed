rootProject.name = "{{appName}}"

// servers
includeBuild("server/jvm") {
    name = "genesisproduct-{{appName}}"
}

// clients
includeBuild("client")

val isCiServer = System.getenv().containsKey("CI")
buildCache {
    local {
        directory = if (!isCiServer) File(rootDir, "build-cache") else null
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
