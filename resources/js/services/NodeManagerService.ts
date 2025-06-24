/**
 * Node Manager Service - implements INodeManager interface
 * Following Single Responsibility Principle
 */

import { Node } from 'reactflow';
import { INodeManager } from '../interfaces/IWorkflowManager';
import { NodeData } from '../nodes';

export class NodeManagerService implements INodeManager {
  private nodeIdCounter = 0;

  createNode(type: string, position?: { x: number; y: number }): Node {
    const nodeNames: Record<string, string> = {
      trigger: 'Event Trigger',
      condition: 'Filter Condition',
      transform: 'Data Transform',
      analytics_driver: 'Analytics Platform'
    };
    
    const nodeDescriptions: Record<string, string> = {
      trigger: 'Listens for incoming events',
      condition: 'Filters events based on conditions',
      transform: 'Transforms event data',
      analytics_driver: 'Sends data to analytics platform'
    };

    const newNode: Node = {
      id: this.generateNodeId(),
      type: type || 'unknown',
      position: position || { x: 100, y: 100 },
      data: {
        label: nodeNames[type] || 'New Node',
        config: {},
        description: nodeDescriptions[type] || '',
        hasError: false
      } as NodeData,
      draggable: true,
      selectable: true,
    };

    return newNode;
  }

  validateNode(node: Node): boolean {
    if (!node.id || !node.type) {
      return false;
    }

    if (!node.data || typeof node.data !== 'object') {
      return false;
    }

    const nodeData = node.data as NodeData;
    if (!nodeData.label) {
      return false;
    }

    return true;
  }

  getNodePosition(nodeType: string, existingNodes: Node[]): { x: number; y: number } {
    const typeOrder = ['trigger', 'condition', 'transform', 'analytics_driver'];
    const typeIndex = typeOrder.indexOf(nodeType);
    const sameTypeNodes = existingNodes.filter(n => n.type === nodeType);
    
    const horizontalSpacing = 300;
    const verticalSpacing = 150;
    const startX = 100;
    const startY = 200;
    
    return {
      x: startX + (typeIndex * horizontalSpacing),
      y: startY + (sameTypeNodes.length * verticalSpacing)
    };
  }

  duplicateNode(node: Node): Node {
    const duplicatedNode: Node = {
      id: this.generateNodeId(),
      type: node.type,
      position: { 
        x: node.position.x + 50, 
        y: node.position.y + 50 
      },
      data: { 
        ...node.data, 
        label: `${(node.data as NodeData).label} Copy` 
      },
      draggable: true,
      selectable: true,
    };

    return duplicatedNode;
  }

  private generateNodeId(): string {
    return `node_${this.nodeIdCounter++}`;
  }

  setNodeIdCounter(value: number): void {
    this.nodeIdCounter = value;
  }
}