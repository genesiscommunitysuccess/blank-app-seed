// Use base plugin to access base tasks (clean, assemble, check, and build).
plugins {
    base
}

tasks {
    val tasks = listOf("clean", "assemble", "check", "build")
    for(taskName in tasks){
        named(taskName){
            gradle.includedBuilds.forEach {
                dependsOn(it.task(":$taskName"))
            }
        }
    }
    wrapper {
        description = "Regenerates the Gradle Wrapper files"
        gradleVersion = "7.2"
        distributionUrl = "http://services.gradle.org/distributions/gradle-${gradleVersion}-all.zip"
    }
}