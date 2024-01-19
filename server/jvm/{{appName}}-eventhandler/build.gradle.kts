dependencies {
    implementation(genesis("genesis-pal-execution"))
    implementation(genesis("genesis-eventhandler"))
    implementation(project(":position-app-legacy-messages"))
    api("global.genesis:genesis-db")
    compileOnly(project(":position-app-legacy-config"))
    testImplementation("global.genesis:genesis-dbtest")
    testImplementation("global.genesis:genesis-testsupport")
    genesisGeneratedCode()
}

description = "{{appName}}-eventhandler"
