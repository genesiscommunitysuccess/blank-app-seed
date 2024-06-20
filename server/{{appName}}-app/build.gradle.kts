dependencies {
    compileOnly(genesis("script-dependencies"))
    genesisGeneratedCode(withTestDependency = true)
    testImplementation(genesis("dbtest"))
    testImplementation(genesis("testsupport"))
    testImplementation(genesis("pal-eventhandler"))
}

description = "{{appName}}-app"

sourceSets {
    main {
        resources {
            srcDirs("src/main/resources", "src/main/genesis")
        }
    }
}
tasks{
    test {
        useJUnitPlatform {}
    }
}
