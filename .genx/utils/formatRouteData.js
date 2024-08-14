const {
  gridOptionsSerializer,
  gridColumnsSerializer,
} = require('./gridSerializers');
const formatJSONValue = require('./formatJSONValue');
const getLayoutType = require('./getLayoutType');
const { COMPONENT_TYPE, FRAMEWORK_ANGULAR_ALIAS } = require('../static');

const formatRouteData = (framework, route) => {
  const layoutKey = route?.layoutKey || `${route.name}_${Date.now()}`;
  const layoutType =
    framework === FRAMEWORK_ANGULAR_ALIAS
      ? 'tabs-panel'
      : route?.layoutType || getLayoutType(route);

  const FDC3ClickCategory = 'fdc3';
  const FDC3EventHandlersEnabled = !!route.tiles?.find(
    (t) => t.config?.gridOptions?.onRowClicked?.category === FDC3ClickCategory,
  );
  const tiles = route.tiles?.map((tile, index) => {
    const config = tile.config || {};
    const componentType = COMPONENT_TYPE[tile.type];
    const componentName = `${route.name}-${tile.title.replace(/[^0-9a-z]/gi, '')}-${componentType}`;
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
      componentType,
      config: {
        ...config,
        index,
        gridOptions: gridOptionsSerializer(gridOptions),
        useOnlyTemplateCols: !!gridOptions?.columnDefs,
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
