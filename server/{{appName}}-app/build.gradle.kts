plugins {
    id("global.genesis.bdd_automation")
}

dependencies {
    compileOnly(genesis("script-dependencies"))
    genesisGeneratedCode(withTestDependency = true)
    genesisWeb("global.genesis:client")
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