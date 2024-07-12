export interface LayersState {
  [key: string]: boolean; // Each key is a layer name, value is its visibility (true/false)
}

export interface LayerContextState {
  state: LayersState;
  updateState: (newState: Partial<LayerContextState['state']>) => void;
  setLayerState: (layerName: string, isVisible: boolean) => void;
}
