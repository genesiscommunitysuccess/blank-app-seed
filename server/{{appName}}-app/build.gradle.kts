dependencies {
    compileOnly(genesis("script-dependencies"))
    genesisGeneratedCode(withTestDependency = true)
}

description = "{{appName}}-app"

sourceSets {
    main {
        resources {
            srcDirs("src/main/resources", "src/main/genesis")
        }
    }
}
