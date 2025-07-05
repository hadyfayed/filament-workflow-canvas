// Workflow Canvas - Complete system in a single file
import React from 'react';

// Import main components
export { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
export type { WorkflowCanvasProps } from './components/canvas/WorkflowCanvas';
export { NodePropertiesPanel } from './components/properties/NodePropertiesPanel';
export type { NodePropertiesPanelProps } from './components/properties/NodePropertiesPanel';
export { Toolbar } from './components/toolbar/Toolbar';
export type { ToolbarProps } from './components/toolbar/Toolbar';
export { CustomControls } from './components/controls/CustomControls';
export type { CustomControlsProps } from './components/controls/CustomControls';

// Re-export all component categories
export * from './components';

// Export services and interfaces
export * from './services';
export * from './factories/WorkflowServiceFactory';

// Export hooks and utilities
export * from './hooks/useConfirm';
export * from './hooks/useNodeState';
export * from './utils';
export * from './nodes';

// Export specific types to avoid conflicts
export type { NodeType, NodeData, CanvasConfig } from './types';
export type {
  WorkflowNode,
  WorkflowConnection,
  WorkflowData,
  IWorkflowManager,
  INodeManager,
  IConnectionManager,
  IViewportManager,
  IWorkflowPersistence,
  IWorkflowEventSystem,
} from './interfaces/IWorkflowManager';

// Import components for registration
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodePropertiesPanel } from './components/properties/NodePropertiesPanel';
import { Toolbar } from './components/toolbar/Toolbar';
import { CustomControls } from './components/controls/CustomControls';

// Bootstrap function for initialization with React Wrapper v3.0
export function bootstrap() {
  // Use the new React Wrapper v3.0 registration pattern
  if (typeof window !== 'undefined' && (window as any).reactWrapperRegistry) {
    const registry = (window as any).reactWrapperRegistry;

    // Register WorkflowCanvas with lazy loading support
    registry.register('WorkflowCanvas', WorkflowCanvas, {
      lazy: true,
      preload: false,
      dependencies: ['reactflow', '@heroicons/react', 'uuid'],
      category: 'workflow',
      description: 'Visual workflow builder with drag-and-drop interface',
      defaultProps: {
        initialData: null,
        readonly: false,
        showMinimap: true,
      },
    });

    // Register supporting components
    registry.register('NodePropertiesPanel', NodePropertiesPanel, {
      lazy: true,
      category: 'workflow',
      description: 'Properties panel for workflow nodes',
    });

    registry.register('WorkflowToolbar', Toolbar, {
      lazy: true,
      category: 'workflow',
      description: 'Toolbar for workflow actions',
    });

    registry.register('WorkflowControls', CustomControls, {
      lazy: true,
      category: 'workflow',
      description: 'Custom controls for workflow canvas',
    });

    console.log('Workflow Canvas components registered with React Wrapper v3.0');
  } else {
    console.log('Workflow Canvas components loaded (React Wrapper v3.0 not available)');
  }

  return true;
}

// Make functionality globally available
if (typeof window !== 'undefined') {
  (window as any).WorkflowCanvas = {
    WorkflowCanvas,
    NodePropertiesPanel,
    Toolbar,
    CustomControls,
    bootstrap,
  };

  // Auto-bootstrap
  bootstrap();
}

// Default export for easy importing
export default {
  WorkflowCanvas,
  NodePropertiesPanel,
  Toolbar,
  CustomControls,
  bootstrap,
};
