/**
 * Workflow Event Service - implements IWorkflowEventSystem interface
 * Following Single Responsibility Principle
 */

import { Node, Edge } from 'reactflow';
import { IWorkflowEventSystem, WorkflowData } from '../interfaces/IWorkflowManager';

export class WorkflowEventService implements IWorkflowEventSystem {
  private listeners: Map<string, Array<{ callback: Function; priority: number }>> = new Map();

  onNodeAdded(callback: (node: Node) => void): void {
    this.on('node:added', callback);
  }

  onNodeUpdated(callback: (node: Node) => void): void {
    this.on('node:updated', callback);
  }

  onNodeDeleted(callback: (nodeId: string) => void): void {
    this.on('node:deleted', callback);
  }

  onConnectionCreated(callback: (edge: Edge) => void): void {
    this.on('connection:created', callback);
  }

  onWorkflowSaved(callback: (data: WorkflowData) => void): void {
    this.on('workflow:saved', callback);
  }

  emit(event: string, data?: any): void {
    const listeners = this.listeners.get(event);
    if (!listeners) return;

    // Sort by priority (higher number = higher priority)
    const sortedListeners = [...listeners].sort((a, b) => b.priority - a.priority);

    for (const listener of sortedListeners) {
      try {
        listener.callback(data);
      } catch (error) {
        console.error(`Error in workflow event listener for ${event}:`, error);
      }
    }
  }

  on(event: string, callback: Function, priority: number = 10): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)!.push({ callback, priority });
    
    // Sort by priority (higher number = higher priority)
    this.listeners.get(event)!.sort((a, b) => b.priority - a.priority);
  }

  off(event: string, callback: Function): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.findIndex(l => l.callback === callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  hasListeners(event: string): boolean {
    return this.listeners.has(event) && this.listeners.get(event)!.length > 0;
  }

  clear(): void {
    this.listeners.clear();
  }

  getListenerCount(event?: string): number {
    if (event) {
      return this.listeners.get(event)?.length || 0;
    }
    return Array.from(this.listeners.values()).reduce((total, arr) => total + arr.length, 0);
  }

  // Convenience methods for common workflow events
  emitNodeAdded(node: Node): void {
    this.emit('node:added', node);
  }

  emitNodeUpdated(node: Node): void {
    this.emit('node:updated', node);
  }

  emitNodeDeleted(nodeId: string): void {
    this.emit('node:deleted', nodeId);
  }

  emitConnectionCreated(edge: Edge): void {
    this.emit('connection:created', edge);
  }

  emitWorkflowSaved(data: WorkflowData): void {
    this.emit('workflow:saved', data);
  }
}