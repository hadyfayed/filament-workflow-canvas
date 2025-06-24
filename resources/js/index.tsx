import { componentRegistry } from '@hadyfayed/filament-react-wrapper/core';
import WorkflowCanvas from './WorkflowCanvas';
import NodePropertiesPanel from './NodePropertiesPanel';
import { Toolbar as ToolbarPanel } from './ToolbarPanel';
import { CustomControls as CustomControlsPanel } from './CustomControlsPanel';
import * as nodeTypes from './nodes';

// Register workflow components with enhanced metadata
componentRegistry.register({
    name: 'WorkflowCanvas',
    component: WorkflowCanvas,
    defaultProps: {
        initialData: null,
        readonly: false,
        showMinimap: true,
        showControls: true,
    },
    metadata: {
        description: 'Visual workflow builder canvas component',
        category: 'workflow',
        tags: ['canvas', 'workflow', 'builder', 'visual'],
    }
});

componentRegistry.register({
    name: 'NodePropertiesPanel', 
    component: NodePropertiesPanel,
    defaultProps: {},
    metadata: {
        description: 'Properties panel for workflow nodes',
        category: 'workflow',
        tags: ['panel', 'properties', 'workflow'],
    }
});

componentRegistry.register({
    name: 'WorkflowToolbar', 
    component: ToolbarPanel,
    defaultProps: {},
    metadata: {
        description: 'Toolbar for workflow canvas',
        category: 'workflow',
        tags: ['toolbar', 'workflow'],
    }
});

componentRegistry.register({
    name: 'WorkflowControls', 
    component: CustomControlsPanel,
    defaultProps: {},
    metadata: {
        description: 'Custom controls for workflow canvas',
        category: 'workflow',
        tags: ['controls', 'workflow'],
    }
});

// Export components for direct use
export {
    WorkflowCanvas,
    NodePropertiesPanel,
    ToolbarPanel,
    CustomControlsPanel,
    nodeTypes,
};

// Export workflow-specific utilities
export * from './types';
export * from './utils';

// Log component registration in non-production environments
if (process.env.NODE_ENV !== 'production') {
    console.log('Workflow Canvas components registered:', [
        'WorkflowCanvas', 
        'NodePropertiesPanel',
        'WorkflowToolbar',
        'WorkflowControls'
    ]);
}