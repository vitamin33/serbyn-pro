import * as Diagrams from './index';
import {
  PogBlindSpots,
  PogEvalVsGuardrail,
  PogFlagFunnel,
  PogTierLanes,
  PogTurnDiagram,
  PogWhyWrong,
} from './examples/proof-of-green';

// Everything a post can use as <Name …/> in MDX. Handed to the compiler in
// lib/mdx.tsx together with the article elements.
export const diagramComponents = {
  Diagram: Diagrams.Diagram,
  Box: Diagrams.Box,
  Boundary: Diagrams.Boundary,
  Arrow: Diagrams.Arrow,
  Lane: Diagrams.Lane,
  Marker: Diagrams.Marker,
  Badge: Diagrams.Badge,
  Pill: Diagrams.Pill,
  Diamond: Diagrams.Diamond,
  Group: Diagrams.Group,
  Note: Diagrams.Note,
  SectionLabel: Diagrams.SectionLabel,
  Divider: Diagrams.Divider,
  Text: Diagrams.Text,
  FlowDiagram: Diagrams.FlowDiagram,
  LoopDiagram: Diagrams.LoopDiagram,
  ArchitectureDiagram: Diagrams.ArchitectureDiagram,
  SwimlaneDiagram: Diagrams.SwimlaneDiagram,
  ComparisonDiagram: Diagrams.ComparisonDiagram,
  ObjectiveTree: Diagrams.ObjectiveTree,
  RegionsDiagram: Diagrams.RegionsDiagram,
  GraphDiagram: Diagrams.GraphDiagram,
  StateMachine: Diagrams.StateMachine,
  PogTurnDiagram,
  PogTierLanes,
  PogEvalVsGuardrail,
  PogFlagFunnel,
  PogWhyWrong,
  PogBlindSpots,
};
