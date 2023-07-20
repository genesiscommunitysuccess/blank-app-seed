import com.github.gradle.node.npm.task.NpmTask

plugins {
    base
    id("com.github.node-gradle.node")
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

tasks {
    val npmBuild = register("npmBuild", NpmTask::class) {
        args.set(listOf("run", "build"))
        inputs.dir("src")
        outputs.dir("dist")
        dependsOn(npmInstall)
    }

    distZip {
        dependsOn(npmBuild)
    }

    assemble {
        dependsOn(npmBuild)
    }

    npmInstall {
        dependsOn(":npmBootstrap")
    }

}

artifacts {
    val distzip = tasks.distZip.get()
    add("default", distzip.archiveFile) {
        builtBy(distzip)
    }
}
