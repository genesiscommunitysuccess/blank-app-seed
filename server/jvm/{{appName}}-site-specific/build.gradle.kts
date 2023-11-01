description = "{{appName}}-script-config"

plugins {
    distribution
    `maven-publish`
    id("com.jfrog.artifactory") version "4.29.0"
}

group = "global.genesis"
version = "1.0.0-SNAPSHOT"
val distribution by configurations.creating {
    isCanBeConsumed = true
    isCanBeResolved = false
}
dependencies {
    compileOnly("global.genesis:genesis-config")
}
distributions {
    main {
        contents {
            // Octal conversion for file permissions
            val libPermissions = "600".toInt(8)
            val scriptPermissions = "700".toInt(8)
            into("site-specific/cfg") {
                from("${project.rootProject.projectDir}/{{appName}}-site-specific/src/main/resources/cfg")
                filter(
                    org.apache.tools.ant.filters.FixCrLfFilter::class,
                    "eol" to org.apache.tools.ant.filters.FixCrLfFilter.CrLf.newInstance("lf")
                )
            }
            into("site-specific/scripts") {
                from("${project.rootProject.projectDir}/{{appName}}-site-specific/src/main/resources/scripts")
                filter(
                    org.apache.tools.ant.filters.FixCrLfFilter::class,
                    "eol" to org.apache.tools.ant.filters.FixCrLfFilter.CrLf.newInstance("lf")
                )
                fileMode = scriptPermissions
            }
            into("site-specific/data") {
                from("${project.rootProject.projectDir}/{{appName}}-site-specific/src/main/resources/data")
                filter(
                    org.apache.tools.ant.filters.FixCrLfFilter::class,
                    "eol" to org.apache.tools.ant.filters.FixCrLfFilter.CrLf.newInstance("lf")
                )
            }
            // Removes intermediate folder called with the same name as the zip archive.
            into("/")
        }
    }
}
// To give custom name to the distribution package
tasks {
    distZip {
        archiveBaseName.set("{{appName}}-site-specific")
        archiveClassifier.set("bin")
        archiveExtension.set("zip")
    }
}
artifacts {
    val distzip = tasks.distZip.get()
    add("distribution", distzip.archiveFile) {
        builtBy(distzip)
    }
}
publishing {
    publications {
        create<MavenPublication>("{{appName}}SiteSpecificDistribution") {
            artifact(tasks.distZip.get())
        }
    }
}
artifactory {
    setContextUrl("https://genesisglobal.jfrog.io/genesisglobal")
    val targetRepoKey = "libs-${buildTagFor(project.version.toString())}-local"
    // Add all publication list to publicationNames
    // These are the necessary publications for everything genesis related.
    val publicationNames = arrayOf("{{appName}}SiteSpecificDistribution")
    publish(
        delegateClosureOf<org.jfrog.gradle.plugin.artifactory.dsl.PublisherConfig> {
            repository(
                delegateClosureOf<groovy.lang.GroovyObject> {
                    setProperty("repoKey", targetRepoKey)
                    setProperty("username", property("genesisArtifactoryUser").toString())
                    setProperty("password", property("genesisArtifactoryPassword").toString())
                    setProperty("maven", true)
                }
            )
            defaults(
                delegateClosureOf<groovy.lang.GroovyObject> {
                    invokeMethod("publications", publicationNames)
                }
            )
        }
    )
    resolve(
        delegateClosureOf<org.jfrog.gradle.plugin.artifactory.dsl.ResolverConfig> {
            repository(
                delegateClosureOf<groovy.lang.GroovyObject> {
                    setProperty("repoKey", targetRepoKey)
                    setProperty("username", property("genesisArtifactoryUser").toString())
                    setProperty("password", property("genesisArtifactoryPassword").toString())
                    setProperty("maven", true)
                }
            )
        }
    )
}
fun buildTagFor(version: String): String =
    when (version.substringAfterLast('-')) {
        "SNAPSHOT" -> "snapshot"
        in Regex("""M\d+[a-z]*$""") -> "milestone"
        else -> "release"
    }
operator fun Regex.contains(s: String) = matches(s)
