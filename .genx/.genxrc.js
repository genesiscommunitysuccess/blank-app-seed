const load = (path) => () => {
  try {
    return require(`./${path}`);
  } catch (e) {
    return {};
  }
}

// GenX CLI Configuration
module.exports = {
  // Answers persisted during the latest configure call
  answers: load('answers.json'),
  // Build files and directories within the seed
  build: load('build'),
  // Script used to configure the seed
  configure: load('configure'),
  // Additional seed details beyond what was captured during seed registration.
  details: load('details'),
  // NPM scripts key map
  npmScripts: load('npmScripts'),
  // Lerna packages / directories within the seed.
  packages: load('packages'),
  // Prompts used to capture seed configuration values.
  prompts: load('prompts'),
  // Plop.js templates used for seed specific code generation.
  templates: load('templates'),
  // The tsconfig files within the seed.
  tsconfigs: load('tsconfigs'),
};
