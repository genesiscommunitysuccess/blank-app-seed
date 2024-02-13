dependencies {
    implementation(genesis("pal-execution"))
    implementation(genesis("eventhandler"))
    implementation(project(":{{appName}}-messages"))
    api(genesis("db"))
    compileOnly(project(":{{appName}}-config"))
    testImplementation(genesis("dbtest"))
    testImplementation(genesis("testsupport"))
    genesisGeneratedCode(true)
}

description = "{{appName}}-eventhandler"
