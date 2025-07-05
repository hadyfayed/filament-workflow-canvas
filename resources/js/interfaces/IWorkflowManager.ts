/**
 * Workflow Manager Interface - defines contract for workflow management
 * Following Interface Segregation Principle
 */

import { Node, Edge, Viewport } from 'reactflow';

export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  description?: string;
  config?: Record<string, any>;
  position: { x: number; y: number };
  is_enabled: boolean;
}

export interface WorkflowConnection {
  source_node_id: string;
  target_node_id: string;
  conditions: Record<string, any>;
}

export interface WorkflowData {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  viewport: { x: number; y: number; zoom: number };
}

export interface IWorkflowManager {
  saveWorkflow(nodes: Node[], edges: Edge[], viewport: Viewport): Promise<WorkflowData>;
  loadWorkflow(data: WorkflowData): { nodes: Node[]; edges: Edge[] };
  validateWorkflow(nodes: Node[], edges: Edge[]): boolean;
  exportWorkflow(data: WorkflowData, format: 'json' | 'yaml'): string;
}

export interface INodeManager {
  setNodeIdCounter(arg0: number): unknown;
  createNode(type: string, position?: { x: number; y: number }): Node;
  validateNode(node: Node): boolean;
  getNodePosition(nodeType: string, existingNodes: Node[]): { x: number; y: number };
  duplicateNode(node: Node): Node;
}

export interface IConnectionManager {
  validateConnection(sourceType: string, targetType: string): boolean;
  createConnection(source: string, target: string): Edge;
  getValidTargets(sourceType: string): string[];
  getConnectionRules(): Record<string, string[]>;
}

export interface IViewportManager {
  fitView(instance: any, options?: any): void;
  zoomIn(instance: any): void;
  zoomOut(instance: any): void;
  updateViewport(viewport: Viewport): void;
}

export interface IWorkflowPersistence {
  save(key: string, data: WorkflowData): Promise<void>;
  load(key: string): Promise<WorkflowData | null>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface IWorkflowEventSystem {
  emitNodeAdded(newNode: Node): unknown;
  emitWorkflowSaved(workflowData: WorkflowData): unknown;
  emitNodeUpdated(updatedNode: Node): unknown;
  emitNodeDeleted(nodeId: string): unknown;
  emitConnectionCreated(edge: Edge): unknown;
  onNodeAdded(callback: (node: Node) => void): void;
  onNodeUpdated(callback: (node: Node) => void): void;
  onNodeDeleted(callback: (nodeId: string) => void): void;
  onConnectionCreated(callback: (edge: Edge) => void): void;
  onWorkflowSaved(callback: (data: WorkflowData) => void): void;
  emit(event: string, data?: any): void;
}
