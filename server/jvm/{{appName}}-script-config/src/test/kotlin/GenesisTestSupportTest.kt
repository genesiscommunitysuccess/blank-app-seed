package global.genesis

import global.genesis.commons.model.GenesisSet
import global.genesis.dictionary.GenesisDictionary
import global.genesis.testsupport.AbstractGenesisTestSupport
import global.genesis.testsupport.GenesisTestConfig
import org.junit.Test

class GenesisTestSupportTest : AbstractGenesisTestSupport<GenesisSet>(
    GenesisTestConfig {
        addPackageName("global.genesis.testsupport")
        genesisHome = "/GenesisHome/"
        parser = { it }
    }
) {
    override fun createDictionary(): GenesisDictionary = prodDictionary()

    @Test
    fun startsCorrectlyTest() {
        // Just to ensure it loads the Test Support/Cluster correctly
        println("Hello Test Support!!")
    }
}
