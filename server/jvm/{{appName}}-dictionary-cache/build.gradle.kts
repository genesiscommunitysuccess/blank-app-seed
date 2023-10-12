
// Add your genesis config dependencies here
dependencies {
    implementation(project(":{{appName}}-dictionary-cache:{{appName}}-generated-dao"))
    implementation(project(":{{appName}}-dictionary-cache:{{appName}}-generated-fields"))
    implementation(project(":{{appName}}-dictionary-cache:{{appName}}-generated-hft"))
    implementation(project(":{{appName}}-dictionary-cache:{{appName}}-generated-sysdef"))
    implementation(project(":{{appName}}-dictionary-cache:{{appName}}-generated-view"))

    implementation("global.genesis:auth-config:${properties["authVersion"]}")
}

description = "{{appName}}-dictionary-cache"
