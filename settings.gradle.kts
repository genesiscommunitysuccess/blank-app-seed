val gradleFolder: File = rootProject.projectDir.resolve("gradle")
if (gradleFolder.exists()) {
    // servers
    includeBuild("server")

    // clients
    includeBuild("client")

    // bdd tests
    includeBuild("bdd-tests")
}