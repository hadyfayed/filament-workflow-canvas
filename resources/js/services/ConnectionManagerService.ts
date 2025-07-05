/**
 * Connection Manager Service - implements IConnectionManager interface
 * Following Single Responsibility Principle
 */

import { Edge, MarkerType } from 'reactflow';
import { IConnectionManager } from '../interfaces/IWorkflowManager';

export class ConnectionManagerService implements IConnectionManager {
  private validConnections: Record<string, string[]> = {
    trigger: ['condition', 'transform', 'analytics_driver'],
    condition: ['transform', 'analytics_driver'],
    transform: ['analytics_driver'],
    analytics_driver: [],
  };

  validateConnection(sourceType: string, targetType: string): boolean {
    return this.validConnections[sourceType]?.includes(targetType) || false;
  }

  createConnection(source: string, target: string): Edge {
    const edgeStyle = {
      stroke: '#3b82f6',
      strokeWidth: 2,
      strokeDasharray: '5,5',
    };

    return {
      id: `edge_${source}_${target}_${Date.now()}`,
      source,
      target,
      type: 'smoothstep',
      animated: true,
      style: edgeStyle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#3b82f6',
        width: 20,
        height: 20,
      },
      className: 'animate-pulse',
    };
  }

  getValidTargets(sourceType: string): string[] {
    return this.validConnections[sourceType] || [];
  }

  getConnectionRules(): Record<string, string[]> {
    return { ...this.validConnections };
  }

  addConnectionRule(sourceType: string, targetTypes: string[]): void {
    this.validConnections[sourceType] = [...targetTypes];
  }

  removeConnectionRule(sourceType: string): void {
    delete this.validConnections[sourceType];
  }
}
