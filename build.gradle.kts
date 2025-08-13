// Use base plugin to access base tasks (clean, assemble, check, and build).
plugins {
    base
}

tasks {
    val tasks = listOf("clean", "assemble", "check", "build")
    for (taskName in tasks) {
        named(taskName) {
            gradle.includedBuilds.forEach {
                if (!it.name.endsWith("bdd-tests")) dependsOn(it.task(":$taskName"))
            }
        }
    }
}
