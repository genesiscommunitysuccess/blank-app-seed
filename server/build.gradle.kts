import org.jetbrains.kotlin.gradle.dsl.JvmDefaultMode
import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.dsl.KotlinVersion

ext.set("localDaogenVersion", "{{localGenId}}")

plugins {
    `maven-publish`
    id("global.genesis.genesis-start-gui")
    kotlin("jvm")
}

subprojects {
    apply(plugin = "org.gradle.maven-publish")
    apply(plugin = "global.genesis.test")
    apply(plugin = "org.jetbrains.kotlin.jvm")

    dependencies {
        implementation("com.h2database:h2")
        testImplementation(kotlin("test-junit5"))
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
    test {
        for(subproject in subprojects){
            dependsOn(subproject.tasks.named("test"))
        }
    }
}

allprojects {

    group = "{{groupId}}"
    version = "{{applicationVersion}}"


    kotlin {
        jvmToolchain(17)
        compilerOptions {
            freeCompilerArgs.addAll("-Xjsr305=strict")
            jvmDefault.set(JvmDefaultMode.NO_COMPATIBILITY)
            jvmTarget.set(JvmTarget.JVM_17)
            apiVersion.set(KotlinVersion.KOTLIN_2_3)
        }
    }
    tasks.withType<Jar> {
        duplicatesStrategy = DuplicatesStrategy.WARN
    }

    java {
        toolchain {
            languageVersion.set(JavaLanguageVersion.of(17))
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
            val repoUrl = if(properties["useDevRepo"] == "true") {
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
    }

    publishing {
        publications.create<MavenPublication>("maven") {
            from(components["java"])
        }
    }
    tasks{
        test {
            systemProperty("DbLayer", "SQL")
            systemProperty("DbHost", "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1")
            systemProperty("DbQuotedIdentifiers", "true")
            useJUnitPlatform()
        }
    }
}
