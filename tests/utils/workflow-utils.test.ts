import { describe, it, expect } from 'vitest';
import {
  validateWorkflowData,
  createWorkflowNode,
  createWorkflowConnection,
  hasWorkflowCycles,
  validateWorkflow
} from '../../resources/js/utils';
import { WorkflowData, WorkflowNode, WorkflowConnection } from '../../resources/js/types';

describe('Workflow Utils', () => {
  describe('validateWorkflowData', () => {
    it('validates correct workflow data', () => {
      const validData: WorkflowData = {
        nodes: [],
        connections: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      };
      expect(validateWorkflowData(validData)).toBe(true);
    });

    it('rejects invalid workflow data', () => {
      expect(validateWorkflowData(null)).toBe(false);
      expect(validateWorkflowData({})).toBe(false);
      expect(validateWorkflowData({ nodes: 'invalid' })).toBe(false);
    });
  });

  describe('createWorkflowNode', () => {
    it('creates a node with default name', () => {
      const node = createWorkflowNode('action', { x: 100, y: 200 });
      expect(node.type).toBe('action');
      expect(node.position).toEqual({ x: 100, y: 200 });
      expect(node.name).toBe('Action Node');
      expect(node.label).toBe('Action Node');
      expect(node.is_enabled).toBe(true);
      expect(node.id).toMatch(/^node_/);
    });

    it('creates a node with custom name', () => {
      const node = createWorkflowNode('trigger', { x: 0, y: 0 }, 'My Trigger');
      expect(node.name).toBe('My Trigger');
      expect(node.label).toBe('My Trigger');
    });
  });

  describe('createWorkflowConnection', () => {
    it('creates a connection between nodes', () => {
      const connection = createWorkflowConnection('node1', 'node2', { when: 'success' });
      expect(connection.source_node_id).toBe('node1');
      expect(connection.target_node_id).toBe('node2');
      expect(connection.conditions).toEqual({ when: 'success' });
    });
  });

  describe('hasWorkflowCycles', () => {
    it('detects no cycles in linear workflow', () => {
      const data: WorkflowData = {
        nodes: [
          { id: 'a', type: 'trigger', name: 'A', label: 'A', config: {}, position: { x: 0, y: 0 }, is_enabled: true },
          { id: 'b', type: 'action', name: 'B', label: 'B', config: {}, position: { x: 0, y: 0 }, is_enabled: true }
        ],
        connections: [
          { source_node_id: 'a', target_node_id: 'b', conditions: {} }
        ],
        viewport: { x: 0, y: 0, zoom: 1 }
      };
      expect(hasWorkflowCycles(data)).toBe(false);
    });

    it('detects cycles in circular workflow', () => {
      const data: WorkflowData = {
        nodes: [
          { id: 'a', type: 'trigger', name: 'A', label: 'A', config: {}, position: { x: 0, y: 0 }, is_enabled: true },
          { id: 'b', type: 'action', name: 'B', label: 'B', config: {}, position: { x: 0, y: 0 }, is_enabled: true }
        ],
        connections: [
          { source_node_id: 'a', target_node_id: 'b', conditions: {} },
          { source_node_id: 'b', target_node_id: 'a', conditions: {} }
        ],
        viewport: { x: 0, y: 0, zoom: 1 }
      };
      expect(hasWorkflowCycles(data)).toBe(true);
    });
  });

  describe('validateWorkflow', () => {
    it('requires trigger node', () => {
      const data: WorkflowData = {
        nodes: [
          { id: 'a', type: 'action', name: 'A', label: 'A', config: {}, position: { x: 0, y: 0 }, is_enabled: true }
        ],
        connections: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      };
      const errors = validateWorkflow(data);
      expect(errors).toContain('Workflow must have at least one trigger node');
    });

    it('validates successful workflow', () => {
      const data: WorkflowData = {
        nodes: [
          { id: 'a', type: 'trigger', name: 'A', label: 'A', config: {}, position: { x: 0, y: 0 }, is_enabled: true },
          { id: 'b', type: 'action', name: 'B', label: 'B', config: {}, position: { x: 0, y: 0 }, is_enabled: true }
        ],
        connections: [
          { source_node_id: 'a', target_node_id: 'b', conditions: {} }
        ],
        viewport: { x: 0, y: 0, zoom: 1 }
      };
      const errors = validateWorkflow(data);
      expect(errors).toHaveLength(0);
    });
  });
});