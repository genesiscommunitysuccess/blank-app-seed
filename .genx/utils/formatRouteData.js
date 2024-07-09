const {
  gridOptionsSerializer,
  gridColumnsSerializer,
} = require('./gridSerializers');
const formatJSONValue = require('./formatJSONValue');
const getLayoutType = require('./getLayoutType');

const formatRouteData = (route) => {
  const layoutKey = route?.layoutKey || `${route.name}_${Date.now()}`;
  const layoutType = route?.layoutType || getLayoutType(route);

  const FDC3ClickCategory = 'fdc3';
  const FDC3EventHandlersEnabled = !!route.tiles?.find(
    (t) => t.config?.gridOptions?.onRowClicked?.category === FDC3ClickCategory,
  );
  const tiles = route.tiles?.map((tile, index) => {
    const config = tile.config || {};
    const componentName = `${route.name}-${tile.title.replace(/[^0-9a-z]/gi, '')}-${tile.type}`;
    const {
      gridOptions,
      createFormUiSchema,
      updateFormUiSchema,
      uischema,
      columns,
    } = config;

    return {
      ...tile,
      componentName,
      config: {
        ...config,
        index,
        gridOptions: gridOptionsSerializer(gridOptions),
        createFormUiSchema: formatJSONValue(createFormUiSchema),
        updateFormUiSchema: formatJSONValue(updateFormUiSchema),
        uischema: formatJSONValue(uischema),
        columns: gridColumnsSerializer(columns),
      },
    };
  });

  return {
    ...route,
    layoutType,
    layoutKey,
    tiles,
    FDC3EventHandlersEnabled,
  };
};

module.exports = formatRouteData;
