// GenX CLI Configuration
module.exports = {
  // Script used to configure the seed
  configure: () => require('./configure'),
  // Additional seed details beyond what was captured during seed registration
  details: () => require('./package.json'),
  // Prompts used to capture seed configuration values
  prompts: () => require('./prompts'),
  options: {
    persistAnswers: true,
    processFiles: {
      excludeDirs: ['.git', '.genx', '.github', 'node_modules', '.gradle', 'gradle'],
      rename: true,
      interpolateVariables: {
        enabled: true,
        excludeExts: ['', '.ico', '.png', '.jpg', '.gif', '.lock', '.jar', '.crt', '.key']
      }
    }
  }
};
