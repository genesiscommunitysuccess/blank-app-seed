dependencies {
    implementation(genesis("genesis-script-dependencies"))
    genesisGeneratedCode()
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
