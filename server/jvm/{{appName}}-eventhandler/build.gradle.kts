dependencies {
    implementation(genesis("genesis-pal-execution"))
    implementation(genesis("genesis-eventhandler"))
    implementation(project(":{{appName}}-messages"))
    api(genesis("genesis-db"))
    compileOnly(project(":{{appName}}-config"))
    testImplementation(genesis("genesis-dbtest"))
    testImplementation(genesis("genesis-testsupport"))
    genesisGeneratedCode()
}

description = "{{appName}}-eventhandler"
