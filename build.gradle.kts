// Use base plugin to access base tasks (clean, assemble, check, and build).
plugins {
    base
    java
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
        vendor = JvmVendorSpec.ADOPTIUM
    }
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
}
