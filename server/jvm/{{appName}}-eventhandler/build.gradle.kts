dependencies {
    implementation("global.genesis:genesis-pal-execution")
    implementation("global.genesis:genesis-eventhandler")
    implementation(project(":{{appName}}-messages"))
    api("global.genesis:genesis-db")
    compileOnly(project(":{{appName}}-config"))
    compileOnly(project(path = ":{{appName}}-dictionary-cache", configuration = "codeGen"))
    testImplementation("global.genesis:genesis-dbtest")
    testImplementation("global.genesis:genesis-testsupport")
    testImplementation(project(path = ":{{appName}}-dictionary-cache", configuration = "codeGen"))
}

description = "{{appName}}-eventhandler"