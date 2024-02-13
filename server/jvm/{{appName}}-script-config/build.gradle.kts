dependencies {
    implementation(genesis("script-dependencies"))
    implementation(genesis("pal-execution"))
    compileOnly(genesis("dictionary"))
    testCompileOnly(project(":{{appName}}-config"))
    testImplementation(genesis("dbtest"))
    testImplementation(genesis("testsupport"))
    genesisGeneratedCode()
}

description = "{{appName}}-script-config"
