dependencies {
    compileOnly(genesis("dictionary"))
    compileOnly(genesis("process"))
    compileOnly(genesis("pal-execution"))
    genesisGeneratedCode()
}

description = "{{appName}}-config"
