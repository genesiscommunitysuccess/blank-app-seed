// GenX CLI Configuration
module.exports = {
  // Script used to configure the seed
  configure: () => require('./configure'),
  // Additional seed details beyond what was captured during seed registration
  details: () => require('./details'),
  // Prompts used to capture seed configuration values
  prompts: () => require('./prompts')
};
