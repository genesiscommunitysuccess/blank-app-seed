import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { createLogger } from '@genesislcap/foundation-logger';
import { AppModule } from './app/app.module';
import { registerPBCs } from './pbc/utils';

const logger = createLogger('main');

function bootstrapApp() {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => logger.error(err));
}

registerPBCs()
  .then(hasAssets => logger.debug(hasAssets ? 'PBCs registered' : 'No PBCs detected'))
  .catch((err) => logger.error(err))
  .finally(bootstrapApp)
