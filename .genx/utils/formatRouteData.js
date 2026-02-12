const {
  gridOptionsSerializer,
  gridColumnsSerializer,
} = require('./gridSerializers');
const formatJSONValue = require('./formatJSONValue');
const { getFormattedComment, getFormattedTodo } = require('./getTodosAndComments')
const getLayoutType = require('./getLayoutType');
const { COMPONENT_TYPE, FRAMEWORK_ANGULAR_ALIAS } = require('../static');

const formatCustomEvents = (customEvents) => {
  if (!customEvents) return;

  return customEvents.map(event => ({
    ...event,
    uischema: event.hasForm ? formatJSONValue(event.uischema) : undefined,
    defaultValues: event.defaultValues ? formatJSONValue(event.defaultValues) : undefined,
  }));
};

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
    const metadata = tile.metadata || {};
    const componentType = COMPONENT_TYPE[tile.type];
    const componentName = `${route.name}-${tile.title.replace(/[^0-9a-z]/gi, '')}-${componentType}`;
    const todo = metadata?.todo && getFormattedTodo(metadata.todo);
    const comment = metadata?.comment && getFormattedComment(metadata.comment);

    const {
      gridOptions,
      createFormUiSchema,
      updateFormUiSchema,
      filterFormUiSchema,
      uischema,
      columns,
      customEvents,
      eventing,
    } = config;

    return {
      ...tile,
      componentName,
      componentType,
      config: {
        ...config,
        index,
        gridOptions: gridOptionsSerializer(gridOptions),
        useOnlyTemplateCols: !!gridOptions?.columns,
        createFormUiSchema: formatJSONValue(createFormUiSchema),
        updateFormUiSchema: formatJSONValue(updateFormUiSchema),
        filterFormUiSchema: formatJSONValue(filterFormUiSchema),
        uischema: formatJSONValue(uischema),
        columns: gridColumnsSerializer(columns),
        customEvents: formatCustomEvents(customEvents),
        eventing: {
          publishEventName: eventing?.publishEventName || null,
          listener: eventing?.listener || null,
        },
      },
      metadata: {
        ...metadata,
        todo,
        comment
      }
    };
  });

  return {
    ...route,
    icon: route.icon || 'cog',
    layoutType,
    layoutKey,
    tiles,
    FDC3EventHandlersEnabled,
  };
};

module.exports = formatRouteData;
