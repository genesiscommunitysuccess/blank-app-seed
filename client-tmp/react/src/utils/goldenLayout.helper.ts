const ERROR_PREFIX = 'Golden layout helper - ';

export const setComponentItemsMap = (
  layoutNativeElement: any,
  componentMapInstance: Map<string, any>,
): (() => void) => {
  if (!layoutNativeElement || !layoutNativeElement.layout) {
    throw new Error(`${ERROR_PREFIX} - layout is not defined`);
  }

  const componentSetter = ({ _target: componentItem }: any) => {
    componentMapInstance.set(componentItem.componentName, componentItem);
  };

  layoutNativeElement.layout.on('componentCreated', componentSetter);

  return () => layoutNativeElement.layout.off('componentCreated', componentSetter);
};

const getElementRoot = (componentInstance: any): any => {
  if (componentInstance) {
    const { _element } = componentInstance;
    return _element;
  }

  throw new Error(`${ERROR_PREFIX} - component instance is not defined`);
};

export const getElementsBySelectorFromComponent = (
  componentInstance: any,
  selectorValue: string,
): any => {
  const element = getElementRoot(componentInstance);
  return element.querySelectorAll(`[data-selector=${selectorValue}]`);
};

export const getElementBySelectorFromComponent = (
  componentInstance: any,
  selector: string,
): any => {
  return getElementsBySelectorFromComponent(componentInstance, selector)[0];
};

export const getElementsByTagFromComponent = (
  componentInstance: any,
  tag: string,
): any => {
  const element = getElementRoot(componentInstance);
  return element.getElementsByTagName(tag);
};

export const getElementByTagFromComponent = (
  componentInstance: any,
  tag: string,
): any => {
  return getElementsByTagFromComponent(componentInstance, tag)[0];
};


