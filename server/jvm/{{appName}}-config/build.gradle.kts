dependencies {
    compileOnly(genesis("genesis-dictionary"))
    compileOnly(genesis("genesis-process"))
    compileOnly(genesis("genesis-pal-execution"))
    genesisGeneratedCode()
}

description = "{{appName}}-config"
