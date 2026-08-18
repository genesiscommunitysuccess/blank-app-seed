const {
  gridOptionsSerializer,
  gridColumnsSerializer,
} = require('./gridSerializers');
const formatJSONValue = require('./formatJSONValue');
const toJsStringLiteral = require('./toJsStringLiteral');
const { getFormattedComment, getFormattedTodo } = require('./getTodosAndComments')
const getLayoutType = require('./getLayoutType');
const { COMPONENT_TYPE, FRAMEWORK_ANGULAR_ALIAS } = require('../static');

// The factory the grid serialisers emit for an FDC3 click marker. It lives in the
// generated src/utils/fdc3.ts, which is only written when FDC3EventHandlersEnabled
// is true — so detection has to key off the very same marker the serialisers act on.
const FDC3_EVENT_FACTORY = 'sendEventOnChannel';

const DEFAULT_CONFIRM_MESSAGE = 'Are you sure you want to proceed?';

const formatCustomEvents = (customEvents) => {
  if (!customEvents) return;

  return customEvents.map(event => ({
    ...event,
    // Always a real boolean: the templates emit `hasForm: {{this.hasForm}},`
    // and an omitted flag would otherwise render `hasForm: ,`.
    hasForm: !!event.hasForm,
    uischema: event.hasForm ? formatJSONValue(event.uischema) : undefined,
    defaultValues: event.defaultValues ? formatJSONValue(event.defaultValues) : undefined,
    // Ready-made JS string literals (quotes included) for the sites that emit
    // JS rather than markup. Handlebars can only HTML-escape or not escape at
    // all, and neither is correct for a JS literal: `{{ }}` turns `'` into
    // `&#x27;` and `{{{ }}}` leaves the apostrophe to terminate the string.
    tooltipJs: event.tooltip ? toJsStringLiteral(event.tooltip) : undefined,
    confirmSubmitMessageJs: event.confirmSubmit
      ? toJsStringLiteral(event.confirmSubmit.message || DEFAULT_CONFIRM_MESSAGE)
      : undefined,
  }));
};

const formatRouteData = (framework, route) => {
  const layoutKey = route?.layoutKey || `${route.name}_${Date.now()}`;
  const layoutType =
    framework === FRAMEWORK_ANGULAR_ALIAS
      ? 'tabs-panel'
      : route?.layoutType || getLayoutType(route);

  let FDC3EventHandlersEnabled = false;
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

    const isSmartForm = tile.type === 'smart-form';

    // A smart-form IS a create form, so `createFormUiSchema` and `uischema` name the
    // same thing there. Normalise to `uischema` — the key every framework's form
    // partial actually consumes — so the schema is wired into the form instead of
    // being emitted as an unread constant (and so both keys together cannot emit
    // two `createFormSchema` exports).
    const effectiveUischema = isSmartForm ? uischema || createFormUiSchema : uischema;
    const effectiveCreateFormUiSchema = isSmartForm ? undefined : createFormUiSchema;

    // Permission code the whole tile is gated on, or null when it always renders.
    // A smart-form has no read-only mode, so it is gated on updateRight; every
    // other tile type renders for view-only users and uses updateRight solely to
    // disable its CRUD affordances.
    const { viewRight, updateRight } = config.permissions || {};
    const wholeTileRight = viewRight || (isSmartForm ? updateRight : undefined) || null;
    // `getViewUpdateRightComponent(getUser(), code)` is needed by the whole-tile
    // gate and by the entity-manager CRUD props; emitting it anywhere else would
    // leave unused imports behind.
    const usesPermissionHelper =
      !!wholeTileRight ||
      !!(
        tile.type === 'entity-manager' &&
        updateRight &&
        (config.createEvent || config.updateEvent || config.deleteEvent)
      );

    // An FDC3 marker can sit on any grid handler (onRowClicked, onCellClicked, ...)
    // in either gridOptions or columns, so detect it from the serialised output —
    // exactly what the templates' `ifContains ... 'sendEventOnChannel'` guards see.
    const serialisedGridOptions = gridOptionsSerializer(gridOptions);
    const serialisedColumns = gridColumnsSerializer(columns);
    if (
      serialisedGridOptions?.includes(FDC3_EVENT_FACTORY) ||
      serialisedColumns?.includes(FDC3_EVENT_FACTORY)
    ) {
      FDC3EventHandlersEnabled = true;
    }

    return {
      ...tile,
      componentName,
      componentType,
      // JS string literal (quotes included) for the flexlayout tab names, which
      // are emitted into a TS object rather than into markup.
      titleJs: toJsStringLiteral(tile.title),
      config: {
        ...config,
        index,
        wholeTileRight,
        usesPermissionHelper,
        gridOptions: serialisedGridOptions,
        useOnlyTemplateCols: !!gridOptions?.columns,
        createFormUiSchema: formatJSONValue(effectiveCreateFormUiSchema),
        updateFormUiSchema: formatJSONValue(updateFormUiSchema),
        filterFormUiSchema: formatJSONValue(filterFormUiSchema),
        uischema: formatJSONValue(effectiveUischema),
        columns: serialisedColumns,
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
