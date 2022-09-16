rootProject.name = "genesisproduct-{{appName}}"

pluginManagement {
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
            url = uri("https://genesisglobal.jfrog.io/genesisglobal/dev-repo")
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
include("{{appName}}-dictionary-cache:genesis-generated-sysdef")
include("{{appName}}-dictionary-cache:genesis-generated-fields")
include("{{appName}}-dictionary-cache:genesis-generated-dao")
include("{{appName}}-dictionary-cache:genesis-generated-hft")
include("{{appName}}-dictionary-cache:genesis-generated-view")
include("{{appName}}-deploy")
include("{{appName}}-site-specific")
