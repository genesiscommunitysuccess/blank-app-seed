dependencies {
    implementation(genesis("genesis-script-dependencies"))
    implementation(genesis("genesis-pal-execution"))
    compileOnly(genesis("genesis-dictionary"))
    testCompileOnly(project(":{{appName}}-config"))
    testImplementation(genesis("genesis-dbtest"))
    testImplementation(genesis("genesis-testsupport"))
    genesisGeneratedCode()
}

description = "{{appName}}-script-config"
