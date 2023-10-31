import com.github.gradle.node.npm.task.NpmTask

plugins {
    base
    id("com.github.node-gradle.node") version "3.1.1"
    distribution
}

distributions {
    main {
        distributionBaseName.set("web-distribution")
        contents {
            into ("/") {
                from("dist")
            }
        }
    }
}

artifacts {
    val distzip = tasks.distZip.get()
    add("default", distzip.archiveFile) {
        builtBy(distzip)
    }
}

allprojects {
    apply(plugin = "com.github.node-gradle.node")
    apply(plugin = "base")

    node {
        // Version of Node to use.
        version.set("20.8.1")

        // Version of NPM to use.
        npmVersion.set("10.1.0")

        // If true, it will download node using above parameters.
        // If false, it will try to use globally installed node.
        download.set(false)
    }

    tasks {
        // Setup custom clean task to be run when "clean" task runs.
        val npmClean = register("npmClean", NpmTask::class) {
            args.set(listOf("run", "clean"))
            delete(".bootstrapDone")
        }

        clean {
            // Depend on the custom npmClean task, the default gradle one deletes the "build" folder by default
            // and the project build won't work without it.
            dependsOn(npmClean)
        }
    }
}

tasks {
    val npmBootstrap = register("npmBootstrap", NpmTask::class) {
        val workingDir = layout.projectDirectory.asFile
        args.set(listOf("run", "bootstrap"))
        outputs.upToDateWhen { File(workingDir, ".bootstrapDone").exists() }
        doLast { File(workingDir, ".bootstrapDone").createNewFile() }
    }

    val npmBuild = register("npmBuild", NpmTask::class) {
        args.set(listOf("run", "build"))
        inputs.dir("src")
        outputs.dir("dist")
        dependsOn(npmBootstrap)
    }

    val test = register("test", NpmTask::class) {
        dependsOn(build)
        args.set(listOf("run", "test"))
        inputs.files(fileTree("src"))
        inputs.file("package.json")

        val testsExecutedMarkerName: String = "${projectDir}/.tests.executed"
        // Below some potentially useful config snippets if we want to be efficient with test executions.

        // allows easy triggering re-tests
        doLast {
            File(testsExecutedMarkerName).appendText("delete this file to force re-execution JavaScript tests")
        }
        outputs.file(testsExecutedMarkerName)
    }

    distZip {
        dependsOn(npmBuild)
    }

    distTar {
        dependsOn(npmBuild)
    }

    assemble {
        dependsOn(npmBuild)
    }
}
