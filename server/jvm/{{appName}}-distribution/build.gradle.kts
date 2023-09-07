plugins {
    distribution
}

dependencies {
    implementation(project(":{{appName}}-config"))
    implementation(project(":{{appName}}-dictionary-cache"))
    implementation(project(":{{appName}}-eventhandler"))
    implementation(project(":{{appName}}-messages"))
    implementation(project(":{{appName}}-script-config"))
}

description = "{{appName}}-distribution"

distributions {
    main {
        contents {
            // Octal conversion for file permissions
            val libPermissions = "600".toInt(8)
            val scriptPermissions = "700".toInt(8)
            into("{{appName}}/bin") {
                from(configurations.runtimeClasspath)
                exclude("{{appName}}-config*.jar")
                exclude("{{appName}}-script-config*.jar")
                exclude("{{appName}}-distribution*.jar")
                include("{{appName}}-*.jar")
            }
            into("{{appName}}/lib") {
                from("${project.rootProject.buildDir}/dependencies")
                duplicatesStrategy = DuplicatesStrategy.EXCLUDE

                exclude("genesis-*.jar")
                exclude("{{appName}}-*.jar")
                exclude("*.zip")

                fileMode = libPermissions
            }
            into("{{appName}}/cfg") {
                from("${project.rootProject.projectDir}/{{appName}}-config/src/main/resources/cfg")
                from(project.layout.buildDirectory.dir("generated/product-details"))
                filter(
                    org.apache.tools.ant.filters.FixCrLfFilter::class,
                    "eol" to org.apache.tools.ant.filters.FixCrLfFilter.CrLf.newInstance("lf")
                )
            }
            into("{{appName}}/scripts") {
                from("${project.rootProject.projectDir}/{{appName}}-config/src/main/resources/scripts")
                from("${project.rootProject.projectDir}/{{appName}}-script-config/src/main/resources/scripts")
                filter(
                    org.apache.tools.ant.filters.FixCrLfFilter::class,
                    "eol" to org.apache.tools.ant.filters.FixCrLfFilter.CrLf.newInstance("lf")
                )
                fileMode = scriptPermissions
            }
            // Removes intermediate folder called with the same name as the zip archive.
            into("/")
        }
    }
}

val distribution by configurations.creating {
    isCanBeConsumed = true
    isCanBeResolved = false
}

// To give custom name to the distribution package
tasks {
    distZip {
        archiveBaseName.set("genesisproduct-{{appName}}")
        archiveClassifier.set("bin")
        archiveExtension.set("zip")
    }
    copyDependencies {
        enabled = false
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
        create<MavenPublication>("{{appName}}ServerDistribution") {
            artifact(tasks.distZip.get())
        }
    }
}

description = "{{appName}}-distribution"
