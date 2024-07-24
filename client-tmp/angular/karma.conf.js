module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    browserDisconnectTimeout: 60000, 
    browserDisconnectTolerance: 3, 
    browserNoActivityTimeout: 60000, 
    captureTimeout: 120000,
  });
};