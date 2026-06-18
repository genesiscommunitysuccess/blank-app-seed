import global.genesis.testsupport.jupiter.GenesisTest
import global.genesis.testsupport.jupiter.TestScriptFile
import org.junit.jupiter.api.Test

@GenesisTest
@TestScriptFile("{{appName}}-eventhandler.kts")
internal class GeneratedEventHandlerValidationTest {
    @Test
    fun validatesScriptStartup() {
        // Genesis startup compiles and loads the event handler script.
    }
}
