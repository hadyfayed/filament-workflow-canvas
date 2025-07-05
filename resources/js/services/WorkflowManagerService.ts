/**
 * Workflow Manager Service - implements IWorkflowManager interface
 * Following Single Responsibility Principle
 */

import { Node, Edge, Viewport, MarkerType } from 'reactflow';
import {
  IWorkflowManager,
  IWorkflowPersistence,
  WorkflowData,
  WorkflowNode,
  WorkflowConnection,
} from '../interfaces/IWorkflowManager';
import { NodeData } from '../nodes';

export class WorkflowManagerService implements IWorkflowManager {
  constructor(private persistence?: IWorkflowPersistence) {}

  async saveWorkflow(nodes: Node[], edges: Edge[], viewport: Viewport): Promise<WorkflowData> {
    const workflowData: WorkflowData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type || 'unknown',
        name: (node.data as NodeData).label,
        description: (node.data as NodeData).description || '',
        config: (node.data as NodeData).config || {},
        position: node.position,
        is_enabled: true,
      })),
      connections: edges.map(edge => ({
        source_node_id: edge.source!,
        target_node_id: edge.target!,
        conditions: {},
      })),
      viewport: viewport,
    };

    if (this.persistence) {
      await this.persistence.save('workflow-canvas-data', workflowData);
    }

    return workflowData;
  }

  loadWorkflow(data: WorkflowData): { nodes: Node[]; edges: Edge[] } {
    const reactFlowNodes: Node[] = data.nodes.map((node, index) => ({
      id: node.id || `node_${index}`,
      type: node.type || 'unknown',
      position: node.position || { x: 100 + index * 200, y: 100 },
      data: {
        label: node.name || 'Unnamed Node',
        config: node.config || {},
        description: node.description || '',
        hasError: false,
      } as NodeData,
      draggable: true,
      selectable: true,
    }));

    const reactFlowEdges: Edge[] = data.connections
      ? data.connections.map((conn, index) => ({
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
            type: MarkerType.ArrowClosed,
            color: '#6b7280',
          },
        }))
      : [];

    return { nodes: reactFlowNodes, edges: reactFlowEdges };
  }

  validateWorkflow(nodes: Node[], edges: Edge[]): boolean {
    // Check for orphaned nodes
    const connectedNodeIds = new Set([...edges.map(e => e.source), ...edges.map(e => e.target)]);

    // At least one trigger node should exist
    const triggerNodes = nodes.filter(n => n.type === 'trigger');
    if (triggerNodes.length === 0) {
      return false;
    }

    // All trigger nodes should be connected
    const connectedTriggers = triggerNodes.filter(n => connectedNodeIds.has(n.id));
    if (connectedTriggers.length === 0) {
      return false;
    }

    return true;
  }

  exportWorkflow(data: WorkflowData, format: 'json' | 'yaml'): string {
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else if (format === 'yaml') {
      // Simple YAML export (for full YAML support, would need yaml library)
      const yamlData = [
        'nodes:',
        ...data.nodes.map(node =>
          [
            `  - id: ${node.id}`,
            `    type: ${node.type}`,
            `    name: "${node.name}"`,
            `    position: {x: ${node.position.x}, y: ${node.position.y}}`,
            `    config: ${JSON.stringify(node.config)}`,
          ].join('\n')
        ),
        'connections:',
        ...data.connections.map(conn =>
          [
            `  - source: ${conn.source_node_id}`,
            `    target: ${conn.target_node_id}`,
            `    conditions: ${JSON.stringify(conn.conditions)}`,
          ].join('\n')
        ),
      ];
      return yamlData.join('\n');
    }

    throw new Error(`Unsupported export format: ${format}`);
  }
}
