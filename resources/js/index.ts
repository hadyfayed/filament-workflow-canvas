/**
 * Workflow Canvas - Main entry point
 * Clean exports with no backward compatibility
 */

// Main components
export { default as WorkflowCanvas } from './WorkflowCanvas';
export { default as NodePropertiesPanel } from './NodePropertiesPanel';
export { Toolbar } from './ToolbarPanel';
export { CustomControls } from './CustomControlsPanel';

// Type exports
export type { WorkflowCanvasProps } from './components/canvas/WorkflowCanvas';
export type { NodePropertiesPanelProps } from './components/properties/NodePropertiesPanel';
export type { ToolbarProps } from './components/toolbar/Toolbar';
export type { CustomControlsProps } from './components/controls/CustomControls';

// All component categories
export * from './components';

// Services and interfaces
export * from './interfaces';
export * from './services';
export * from './factories/WorkflowServiceFactory';

// Hooks and utilities
export * from './hooks/useConfirm';
export * from './hooks/useNodeState';
export * from './utils';
export * from './types';
export * from './nodes';