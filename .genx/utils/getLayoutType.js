const getLayoutType = (route) => {
  if (route?.tiles?.length < 4) {
    return 'horizontal-layout';
  } else if (route?.tiles?.length === 4) {
    return 'grid-layout';
  }
  return 'tabs-layout';
};

module.exports = getLayoutType;
