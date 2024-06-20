/**
 * Full documentation on event handler tests may be found here >> https://learn.genesis.global/docs/server/event-handler/testing/#simple-test
 */

import global.genesis.db.rx.entity.multi.AsyncEntityDb
import global.genesis.testsupport.client.eventhandler.EventClientSync
import global.genesis.testsupport.jupiter.GenesisJunit
import global.genesis.testsupport.jupiter.ScriptFile
import javax.inject.Inject
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(GenesisJunit::class)
@ScriptFile("{{appName}}-eventhandler.kts")
class EventHandlerTest {
  @Inject
  lateinit var client: EventClientSync

  @Inject
  lateinit var entityDb: AsyncEntityDb

  @Test
  fun `test EventHandler`(){
    //TODO Write
  }
  
}
