import { WorkflowData, WorkflowNode, WorkflowConnection } from './types';

/**
 * Validate workflow data structure
 */
export function validateWorkflowData(data: any): data is WorkflowData {
  if (!data || typeof data !== 'object') return false;
  
  if (!Array.isArray(data.nodes)) return false;
  if (!Array.isArray(data.connections)) return false;
  
  if (!data.viewport || typeof data.viewport !== 'object') return false;
  if (typeof data.viewport.x !== 'number') return false;
  if (typeof data.viewport.y !== 'number') return false;
  if (typeof data.viewport.zoom !== 'number') return false;
  
  return true;
}

/**
 * Create a new workflow node
 */
export function createWorkflowNode(
  type: string,
  position: { x: number; y: number },
  name?: string
): WorkflowNode {
  return {
    id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
    description: '',
    config: {},
    position,
    is_enabled: true,
  };
}

/**
 * Create a new workflow connection
 */
export function createWorkflowConnection(
  sourceNodeId: string,
  targetNodeId: string,
  conditions: Record<string, any> = {}
): WorkflowConnection {
  return {
    source_node_id: sourceNodeId,
    target_node_id: targetNodeId,
    conditions,
  };
}

/**
 * Convert ReactFlow data to workflow data
 */
export function reactFlowToWorkflowData(
  nodes: any[],
  edges: any[],
  viewport: { x: number; y: number; zoom: number }
): WorkflowData {
  const workflowNodes: WorkflowNode[] = nodes.map(node => ({
    id: node.id,
    type: node.type || 'unknown',
    name: node.data?.label || 'Unnamed Node',
    description: node.data?.description || '',
    config: node.data?.config || {},
    position: node.position,
    is_enabled: true,
  }));

  const workflowConnections: WorkflowConnection[] = edges.map(edge => ({
    source_node_id: edge.source!,
    target_node_id: edge.target!,
    conditions: edge.data?.conditions || {},
  }));

  return {
    nodes: workflowNodes,
    connections: workflowConnections,
    viewport,
  };
}

/**
 * Convert workflow data to ReactFlow data
 */
export function workflowDataToReactFlow(data: WorkflowData) {
  const nodes = data.nodes.map((node, index) => ({
    id: node.id || `node_${index}`,
    type: node.type || 'unknown',
    position: node.position || { x: 100 + index * 200, y: 100 },
    data: {
      label: node.name || 'Unnamed Node',
      config: node.config || {},
      description: node.description || '',
      hasError: false,
    },
  }));

  const edges = data.connections ? data.connections.map((conn, index) => ({
    id: `edge_${index}`,
    source: conn.source_node_id,
    target: conn.target_node_id,
    type: 'smoothstep',
    animated: true,
    style: {
      stroke: '#6b7280',
      strokeWidth: 2,
    },
    markerEnd: {
      type: 'ArrowClosed',
      color: '#6b7280',
    },
    data: {
      conditions: conn.conditions || {},
    },
  })) : [];

  return { nodes, edges };
}

/**
 * Check if workflow has cycles
 */
export function hasWorkflowCycles(data: WorkflowData): boolean {
  const graph: Record<string, string[]> = {};
  
  // Build adjacency list
  data.connections.forEach(connection => {
    if (!graph[connection.source_node_id]) {
      graph[connection.source_node_id] = [];
    }
    graph[connection.source_node_id]!.push(connection.target_node_id);
  });
  
  // DFS cycle detection
  const visited: Record<string, boolean> = {};
  const recursionStack: Record<string, boolean> = {};
  
  const hasCycleDFS = (nodeId: string): boolean => {
    visited[nodeId] = true;
    recursionStack[nodeId] = true;
    
    if (graph[nodeId]) {
      for (const neighbor of graph[nodeId]) {
        if (!visited[neighbor]) {
          if (hasCycleDFS(neighbor)) {
            return true;
          }
        } else if (recursionStack[neighbor]) {
          return true;
        }
      }
    }
    
    delete recursionStack[nodeId];
    return false;
  };
  
  for (const nodeId of Object.keys(graph)) {
    if (!visited[nodeId]) {
      if (hasCycleDFS(nodeId)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get workflow validation errors
 */
export function validateWorkflow(data: WorkflowData): string[] {
  const errors: string[] = [];
  
  // Check for required trigger
  const hasTrigger = data.nodes.some(node => node.type === 'trigger');
  if (!hasTrigger) {
    errors.push('Workflow must have at least one trigger node');
  }
  
  // Check for cycles
  if (hasWorkflowCycles(data)) {
    errors.push('Workflow contains circular dependencies');
  }
  
  // Check for orphaned nodes (nodes with no connections)
  const connectedNodes = new Set<string>();
  data.connections.forEach(conn => {
    connectedNodes.add(conn.source_node_id);
    connectedNodes.add(conn.target_node_id);
  });
  
  const orphanedNodes = data.nodes.filter(node => 
    node.type !== 'trigger' && !connectedNodes.has(node.id)
  );
  
  if (orphanedNodes.length > 0) {
    errors.push(`Found ${orphanedNodes.length} unconnected node(s)`);
  }
  
  return errors;
}

/**
 * Calculate workflow canvas bounds
 */
export function calculateCanvasBounds(data: WorkflowData): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (data.nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  const positions = data.nodes.map(node => node.position);
  const xs = positions.map(pos => pos.x);
  const ys = positions.map(pos => pos.y);
  
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}