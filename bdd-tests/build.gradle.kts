plugins {
    kotlin("jvm") version "2.1.21"
    java
    id("global.genesis.bdd_automation")
}
description = "{{appName}} BDD Testing Framework"

repositories {
    mavenCentral()
    maven {
        val repoUrl = if (properties["useDevRepo"] == "true") {
            "https://genesisglobal.jfrog.io/genesisglobal/dev-repo"
        } else {
            "https://genesisglobal.jfrog.io/genesisglobal/libs-release-client"
        }
        url = uri(repoUrl)
        credentials {
            username = properties["genesisArtifactoryUser"].toString()
            password = properties["genesisArtifactoryPassword"].toString()
        }
    }
    mavenLocal {
        // VERY IMPORTANT!!! EXCLUDE AGRONA AS IT IS A POM DEPENDENCY AND DOES NOT PLAY NICELY WITH MAVEN LOCAL!
        content {
            excludeGroup("org.agrona")
        }
    }
}
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(17))
    }
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
tasks {
    test {
        useJUnitPlatform()
        notCompatibleWithConfigurationCache("Allure test plugin does not support Configuration Cache.")

        // Support for Cucumber tag filtering via system properties
        if (System.getProperty("cucumber.filter.tags") != null) {
            systemProperty("cucumber.filter.tags", System.getProperty("cucumber.filter.tags"))
        }
    }
    named("allureReport") {
        notCompatibleWithConfigurationCache("Allure test plugin does not support Configuration Cache.")
    }
    named("allureGenesisReport") {
        notCompatibleWithConfigurationCache("Allure test plugin does not support Configuration Cache.")
    }
}
