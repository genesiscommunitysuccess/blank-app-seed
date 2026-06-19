import global.genesis.testsupport.jupiter.GenesisTest
import global.genesis.testsupport.jupiter.TestScriptFile
import org.junit.jupiter.api.Test

@GenesisTest
@TestScriptFile("{{appName}}-consolidator.kts")
internal class GeneratedConsolidatorValidationTest {
    @Test
    fun validatesScriptStartup() {
        // Genesis startup compiles and loads the consolidator script.
    }
}
