dependencies {
    compileOnly(genesis("genesis-script-dependencies"))
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

tasks {
    copyDependencies {
        enabled = false
    }
}
