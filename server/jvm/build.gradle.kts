ext.set("localDaogenVersion", "{{localGenId}}")

plugins {
    kotlin("jvm") version "1.7.10"
    `maven-publish`
    id("global.genesis.build")
}

subprojects  {
    apply(plugin = "org.jetbrains.kotlin.jvm")
    apply(plugin = "org.gradle.maven-publish")


    dependencies {
        implementation(platform("global.genesis:genesis-bom:${properties["genesisVersion"]}"))
        implementation("org.agrona:agrona:1.10.0!!")
        testImplementation("org.jetbrains.kotlin:kotlin-test-junit:1.7.10")
        constraints {
            // define versions of your dependencies here so that submodules do not have to define versions
            testImplementation("junit:junit:4.13.2")
        }
    }
    tasks {
        withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
            kotlinOptions {
                freeCompilerArgs = listOf("-Xjsr305=strict", "-Xjvm-default=enable")
            }
        }
        val java = "11"

        compileKotlin {
            kotlinOptions { jvmTarget = java }
        }
    }
}

tasks {
    assemble {
        for(subproject in subprojects){
            dependsOn(subproject.tasks.named("assemble"))
        }
    }
    build {
        for(subproject in subprojects){
            dependsOn(subproject.tasks.named("build"))
        }
    }
    clean {
        for(subproject in subprojects){
            dependsOn(subproject.tasks.named("clean"))
        }
    }
}

allprojects {

    group = "{{groupId}}"
    version = "{{applicationVersion}}"


    kotlin {
        jvmToolchain {
            (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(11))
        }
    }
    tasks.withType<Jar> {
        duplicatesStrategy = DuplicatesStrategy.WARN
    }

    java {
        toolchain {
            languageVersion.set(JavaLanguageVersion.of(11))
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
        }
    }

    publishing {
        publications.create<MavenPublication>("maven") {
            from(components["java"])
        }
    }
}

