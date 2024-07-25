const validateRoute = (route) => {
  if (!route.name) {
    console.warn('Invalid route - missing name', route);
  }
  return !!route.name;
};

module.exports = validateRoute;
