/**
 * Check if a tile has any eventing configuration
 * @param {Object} tile - Tile configuration
 * @returns {boolean}
 */
function hasEventing(tile) {
  return !!(
    tile.eventing &&
    (tile.eventing.publishEventName || tile.eventing.listener)
  );
}

/**
 * Check if a tile publishes events
 * @param {Object} tile - Tile configuration
 * @returns {boolean}
 */
function isPublisher(tile) {
  return !!(tile.eventing && tile.eventing.publishEventName);
}

/**
 * Check if a tile listens to events
 * @param {Object} tile - Tile configuration
 * @returns {boolean}
 */
function isSubscriber(tile) {
  return !!(tile.eventing && tile.eventing.listener);
}

/**
 * Check if any route has eventing configured
 * @param {Array} routes -   Array of route configurations
 * @returns {boolean}
 */
function routesHaveEventing(routes) {
  return routes.some((route) => route.tiles?.some((tile) => hasEventing(tile)));
}

/**
 * Convert string to camelCase
 * @param {string} str - String to convert
 * @returns {string}
 */
function camelCase(str) {
  return str
    .split(/[\s-_]+/)
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

/**
 * Convert string to PascalCase
 * @param {string} str - String to convert
 * @returns {string}
 */
function pascalCase(str) {
  return str
    .split(/[\s-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Convert string to kebab-case
 * @param {string} str - String to convert
 * @returns {string}
 */
function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

module.exports = {
  hasEventing,
  isPublisher,
  isSubscriber,
  routesHaveEventing,
  camelCase,
  pascalCase,
  kebabCase,
};

