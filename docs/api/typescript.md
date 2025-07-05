# TypeScript API Reference

Complete TypeScript API documentation for Workflow Canvas.

## Core Interfaces

### WorkflowData

The main data structure representing a complete workflow.

```typescript
interface WorkflowData {
  id?: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  viewport: { x: number; y: number; zoom: number };
  config?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}
```

### WorkflowNode

Represents a single node in the workflow.

```typescript
interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  name: string;
  description?: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  is_enabled: boolean;
  workflow_id?: number;
  created_at?: string;
  updated_at?: string;
}
```

### WorkflowConnection

Represents a connection between two nodes.

```typescript
interface WorkflowConnection {
  id?: string;
  source_node_id: string;
  target_node_id: string;
  conditions: Record<string, any>;
  source_handle?: string;
  target_handle?: string;
  workflow_id?: number;
  created_at?: string;
  updated_at?: string;
}
```

## Component Props

### WorkflowCanvas

Main workflow canvas component props.

```typescript
interface WorkflowCanvasProps {
  initialData?: WorkflowData | null;
  onDataChange?: (data: WorkflowData) => void;
  readonly?: boolean;
  showMinimap?: boolean;
  showControls?: boolean;
  autoSave?: boolean;
  serviceConfig?: WorkflowServiceConfig;
}
```

### NodePropertiesPanel

Properties panel component for editing node settings.

```typescript
interface NodePropertiesPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, updates: Partial<NodeData>) => void;
  onClose: () => void;
  nodeTypes?: Record<string, NodeType>;
}
```

### Toolbar

Toolbar component for adding new nodes.

```typescript
interface ToolbarProps {
  onNodeAdd: (type: string, position?: { x: number; y: number }) => void;
  availableNodeTypes?: NodeType[];
  disabled?: boolean;
  className?: string;
}
```

### CustomControls

Custom controls for workflow canvas.

```typescript
interface CustomControlsProps {
  onFitView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFullscreen?: () => void;
  onSave?: () => void;
  showFitView?: boolean;
  showZoom?: boolean;
  showFullscreen?: boolean;
  showSave?: boolean;
  disabled?: boolean;
}
```

## Node Types

### NodeType

Configuration for a node type.

```typescript
interface NodeType {
  label: string;
  icon: string;
  color: string;
  has_input: boolean;
  has_output: boolean;
  processor?: string;
}
```

### NodeData

Data structure for ReactFlow nodes.

```typescript
interface NodeData {
  id: string;
  type: string;
  label: string;
  config?: Record<string, any>;
  position?: { x: number; y: number };
  [key: string]: any;
}
```

## Service Interfaces

### IWorkflowManager

Main workflow management interface.

```typescript
interface IWorkflowManager {
  saveWorkflow(nodes: Node[], edges: Edge[], viewport: Viewport): Promise<WorkflowData>;
  loadWorkflow(data: WorkflowData): { nodes: Node[]; edges: Edge[] };
  validateWorkflow(nodes: Node[], edges: Edge[]): boolean;
  exportWorkflow(data: WorkflowData, format: 'json' | 'yaml'): string;
}
```

### INodeManager

Node management interface.

```typescript
interface INodeManager {
  setNodeIdCounter(count: number): void;
  createNode(type: string, position?: { x: number; y: number }): Node;
  validateNode(node: Node): boolean;
  getNodePosition(nodeType: string, existingNodes: Node[]): { x: number; y: number };
  duplicateNode(node: Node): Node;
}
```

### IConnectionManager

Connection management interface.

```typescript
interface IConnectionManager {
  validateConnection(sourceType: string, targetType: string): boolean;
  createConnection(source: string, target: string): Edge;
  getValidTargets(sourceType: string): string[];
  getConnectionRules(): Record<string, string[]>;
}
```

### IViewportManager

Viewport management interface.

```typescript
interface IViewportManager {
  fitView(instance: any, options?: any): void;
  zoomIn(instance: any): void;
  zoomOut(instance: any): void;
  updateViewport(viewport: Viewport): void;
}
```

### IWorkflowPersistence

Persistence interface for saving/loading workflows.

```typescript
interface IWorkflowPersistence {
  save(key: string, data: WorkflowData): Promise<void>;
  load(key: string): Promise<WorkflowData | null>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

### IWorkflowEventSystem

Event system interface for workflow events.

```typescript
interface IWorkflowEventSystem {
  emitNodeAdded(newNode: Node): void;
  emitWorkflowSaved(workflowData: WorkflowData): void;
  emitNodeUpdated(updatedNode: Node): void;
  emitNodeDeleted(nodeId: string): void;
  emitConnectionCreated(edge: Edge): void;
  onNodeAdded(callback: (node: Node) => void): void;
  onNodeUpdated(callback: (node: Node) => void): void;
  onNodeDeleted(callback: (nodeId: string) => void): void;
  onConnectionCreated(callback: (edge: Edge) => void): void;
  onWorkflowSaved(callback: (data: WorkflowData) => void): void;
  emit(event: string, data?: any): void;
}
```

## Configuration

### CanvasConfig

Configuration options for the workflow canvas.

```typescript
interface CanvasConfig {
  autoSave: boolean;
  autoSaveDelay: number;
  fullscreenEnabled: boolean;
  showMinimap: boolean;
  showControls: boolean;
  showBackground: boolean;
  backgroundVariant: 'dots' | 'lines' | 'cross';
  selectionMode: 'partial' | 'full';
}
```

### WorkflowServiceConfig

Service configuration options.

```typescript
interface WorkflowServiceConfig {
  persistenceType?: 'localStorage' | 'memory' | 'none';
  enableEvents?: boolean;
  customPersistence?: IWorkflowPersistence;
  customEventSystem?: IWorkflowEventSystem;
}
```

## Utility Functions

### Workflow Validation

```typescript
function validateWorkflowData(data: any): data is WorkflowData;
function validateWorkflow(data: WorkflowData): string[];
function hasWorkflowCycles(data: WorkflowData): boolean;
```

### Node Creation

```typescript
function createWorkflowNode(
  type: string,
  position: { x: number; y: number },
  name?: string
): WorkflowNode;

function createWorkflowConnection(
  sourceNodeId: string,
  targetNodeId: string,
  conditions?: Record<string, any>
): WorkflowConnection;
```

### Data Conversion

```typescript
function reactFlowToWorkflowData(
  nodes: any[],
  edges: any[],
  viewport: { x: number; y: number; zoom: number }
): WorkflowData;

function workflowDataToReactFlow(data: WorkflowData): {
  nodes: Node[];
  edges: Edge[];
};
```

### Canvas Utilities

```typescript
function calculateCanvasBounds(data: WorkflowData): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};
```

## React Hooks

### useWorkflowServices

Access workflow services from context.

```typescript
function useWorkflowServices(): {
  workflowManager: IWorkflowManager;
  nodeManager: INodeManager;
  connectionManager: IConnectionManager;
  viewportManager: IViewportManager;
  eventSystem: IWorkflowEventSystem;
};
```

### useNodeState

Manage node state with persistence.

```typescript
function useNodeState<T>(
  nodeId: string,
  key: string,
  defaultValue: T
): [T, (value: T) => void];
```

### useConfirm

Simple confirmation dialog hook.

```typescript
function useConfirm(): {
  confirm: (message: string) => Promise<boolean>;
  isConfirming: boolean;
};
```

## Factory Pattern

### WorkflowServiceFactory

Factory for creating workflow services.

```typescript
class WorkflowServiceFactory {
  static getInstance(): WorkflowServiceFactory;
  
  createWorkflowManager(config?: WorkflowServiceConfig): IWorkflowManager;
  createNodeManager(): INodeManager;
  createConnectionManager(): IConnectionManager;
  createViewportManager(): IViewportManager;
  createEventSystem(config?: WorkflowServiceConfig): IWorkflowEventSystem;
  createPersistence(config?: WorkflowServiceConfig): IWorkflowPersistence | undefined;
  
  createAllServices(config?: WorkflowServiceConfig): {
    workflowManager: IWorkflowManager;
    nodeManager: INodeManager;
    connectionManager: IConnectionManager;
    viewportManager: IViewportManager;
    eventSystem: IWorkflowEventSystem;
  };
  
  clearCache(): void;
}
```

## Type Guards

```typescript
// Check if data is valid WorkflowData
if (validateWorkflowData(unknownData)) {
  // unknownData is now typed as WorkflowData
  console.log(unknownData.nodes.length);
}

// Type assertion helpers
function isWorkflowNode(obj: any): obj is WorkflowNode {
  return obj && typeof obj.id === 'string' && typeof obj.type === 'string';
}

function isWorkflowConnection(obj: any): obj is WorkflowConnection {
  return obj && typeof obj.source_node_id === 'string' && typeof obj.target_node_id === 'string';
}
```

## Usage Examples

### Basic TypeScript Setup

```typescript
import React, { useState } from 'react';
import { 
  WorkflowCanvas, 
  WorkflowData, 
  WorkflowCanvasProps 
} from '@hadyfayed/filament-workflow-canvas';

const MyWorkflowBuilder: React.FC = () => {
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);

  const handleDataChange = (data: WorkflowData): void => {
    setWorkflowData(data);
    console.log('Workflow updated:', data);
  };

  const canvasProps: WorkflowCanvasProps = {
    initialData: workflowData,
    onDataChange: handleDataChange,
    readonly: false,
    showMinimap: true,
    autoSave: true,
  };

  return <WorkflowCanvas {...canvasProps} />;
};
```

### Service Usage

```typescript
import { 
  WorkflowServiceFactory, 
  WorkflowServiceConfig 
} from '@hadyfayed/filament-workflow-canvas';

const config: WorkflowServiceConfig = {
  persistenceType: 'localStorage',
  enableEvents: true,
};

const factory = WorkflowServiceFactory.getInstance();
const services = factory.createAllServices(config);

// Use the services
const newNode = services.nodeManager.createNode('trigger', { x: 100, y: 100 });
const isValid = services.nodeManager.validateNode(newNode);
```

## Type Exports

All types are available as named exports:

```typescript
import type {
  // Core types
  WorkflowData,
  WorkflowNode,
  WorkflowConnection,
  NodeType,
  NodeData,
  CanvasConfig,
  
  // Component props
  WorkflowCanvasProps,
  NodePropertiesPanelProps,
  ToolbarProps,
  CustomControlsProps,
  
  // Service interfaces
  IWorkflowManager,
  INodeManager,
  IConnectionManager,
  IViewportManager,
  IWorkflowPersistence,
  IWorkflowEventSystem,
  
  // Configuration
  WorkflowServiceConfig,
} from '@hadyfayed/filament-workflow-canvas';
```