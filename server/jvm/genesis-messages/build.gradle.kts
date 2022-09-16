dependencies {
    implementation("global.genesis:genesis-messages")
    compileOnly(project(path = ":{{appName}}-dictionary-cache", configuration = "codeGen"))
}

description = "{{appName}}-messages"