// Public API of the diagram system. See docs/design/diagram-system.md.
export * from './primitives';
export type { Pt, Rect, Side } from './geometry';
export { anchor, center, orthoRoute, labelSpot } from './geometry';
export { textWidth, fitBox } from './metrics';
export type { PresetBase, NodeData, EdgeData } from './presets/shared';
export { FlowDiagram, type FlowDiagramProps } from './presets/flow';
export { LoopDiagram, type LoopDiagramProps } from './presets/loop';
export {
  ArchitectureDiagram,
  type ArchitectureDiagramProps,
  type ArchNode,
  type ArchBoundary,
} from './presets/architecture';
export {
  SwimlaneDiagram,
  type SwimlaneDiagramProps,
  type LaneEvent,
} from './presets/swimlane';
export {
  ComparisonDiagram,
  type ComparisonDiagramProps,
} from './presets/comparison';
export {
  ObjectiveTree,
  type ObjectiveTreeProps,
  type SubObjective,
  type KeyResult,
} from './presets/objective-tree';
export {
  RegionsDiagram,
  type RegionsDiagramProps,
  type Region,
  type RegionItem,
} from './presets/regions';
export { GraphDiagram, type GraphDiagramProps } from './presets/graph';
export {
  StateMachine,
  type StateMachineProps,
  type State,
} from './presets/state-machine';
