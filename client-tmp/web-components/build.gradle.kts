import com.github.gradle.node.npm.task.NpmTask

plugins {
    base
    id("com.github.node-gradle.node") version "7.0.1"
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

tasks {

    val npmClean = register("npmClean", NpmTask::class) {
        args.set(listOf("run", "clean"))
        delete(".bootstrapDone")
    }

    val npmBootstrap = register("npmBootstrap", NpmTask::class) {
        val workingDir = layout.projectDirectory.asFile
        args.set(listOf("run", "bootstrap"))
        outputs.upToDateWhen { File(workingDir, ".bootstrapDone").exists() }
        doLast { File(workingDir, ".bootstrapDone").createNewFile() }
    }

    val npmAssemble = register("npmAssemble", NpmTask::class) {
        args.set(listOf("run", "build"))
        inputs.dir("src")
        outputs.dir("dist")
        dependsOn(npmBootstrap)
    }

    val test = register("test", NpmTask::class) {
        dependsOn(npmBootstrap)
        dependsOn(assemble)
        args.set(listOf("run", "test"))
        inputs.files(fileTree("src"))
        inputs.file("package.json")

        val testsExecutedMarkerName: String = "${projectDir}/.tests.executed"
        doLast {
            File(testsExecutedMarkerName).appendText("delete this file to force re-execution JavaScript tests")
        }
        outputs.file(testsExecutedMarkerName)
    }

    distZip {
        dependsOn(npmAssemble)
    }

    distTar {
        dependsOn(npmAssemble)
    }

    assemble {
        dependsOn(npmAssemble)
    }
    
    clean {
        dependsOn(npmClean)
    }

    build {
        dependsOn(test)
    }
}
