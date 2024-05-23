const gridOptionsSerializer = require('./gridOptionsSerializer');
const formatJSONValue = require('./formatJSONValue');
const gridColumnsSerializer = require('./gridColumnsSerializer');
const getLayoutType = require('./getLayoutType');

const formatRouteData = (route) => {
  const layoutKey = route?.layoutKey || `${route.name}_${Date.now()}`;
  const layoutType = route?.layoutType || getLayoutType(route);

  const FDC3ClickCategory = 'fdc3';
  const FDC3EventHandlersEnabled = !!route.tiles?.find(t => t.config?.gridOptions?.onRowClicked?.category === FDC3ClickCategory);

  const tiles = route.tiles?.map(tile => ({
    ...tile,
    config: {
      ...(tile.config || {}),
      gridOptions: gridOptionsSerializer(tile.config?.gridOptions),
      createFormUiSchema: formatJSONValue(tile.config?.createFormUiSchema),
      updateFormUiSchema: formatJSONValue(tile.config?.updateFormUiSchema),
      uischema: formatJSONValue(tile.config?.uischema),
      columns: gridColumnsSerializer(tile.config?.columns),
    },
  }));

  return {
    ...route,
    layoutType,
    layoutKey,
    tiles,
    FDC3EventHandlersEnabled,
  };
};

module.exports = formatRouteData;
