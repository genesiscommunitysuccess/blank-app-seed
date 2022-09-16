/**
 * GenX CLI Configuration File.
 */
module.exports = {
  /**
   * The answers persisted during the latest configure call
   */
  answers: () => require('./answers'),
  /**
   * The build files and directories within the seed.
   */
  build: () => require('./build'),
  /**
   * Script used to configure the seed.
   */
  configure: () => require('./configure'),
  /**
   * Additional seed details beyond what was captured during seed registration.
   */
  details: () => require('./details'),
  /**
   * The npm scripts key map
   */
  npmScripts: () => require('./npmScripts'),
  /**
   * The lerna packages / directories within the seed.
   */
  packages: () => require('./packages'),
  /**
   * Prompts used to capture seed configuration values.
   */
  prompts: () => require('./prompts'),
  /**
   * Plop.js templates used for seed specific code generation.
   */
  templates: () => require('./templates'),
  /**
   * The tsconfig files within the seed.
   */
  tsconfigs: () => require('./tsconfigs'),
};
