import com.github.gradle.node.npm.task.NpmTask

plugins {
    base
    id("com.github.node-gradle.node")
    distribution
}

node {
    // Version of node to use.
    version.set("16.13.0")

    // Version of npm to use.
    npmVersion.set("8.1.0")

    // If true, it will download node using above parameters.
    // If false, it will try to use globally installed node.
    download.set(false)
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
