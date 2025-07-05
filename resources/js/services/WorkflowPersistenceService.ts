/**
 * Workflow Persistence Service - implements IWorkflowPersistence interface
 * Following Single Responsibility Principle
 */

import { IWorkflowPersistence, WorkflowData } from '../interfaces/IWorkflowManager';

export class LocalStorageWorkflowPersistence implements IWorkflowPersistence {
  private keyPrefix = 'workflow-';

  async save(key: string, data: WorkflowData): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      const serializedData = JSON.stringify(data);
      const timestamp = new Date().toISOString();

      localStorage.setItem(fullKey, serializedData);
      localStorage.setItem(`${fullKey}-timestamp`, timestamp);

      console.log(`Workflow saved to localStorage: ${fullKey}`);
    } catch (error) {
      console.error('Error saving workflow to localStorage:', error);
      throw new Error(`Failed to save workflow: ${error}`);
    }
  }

  async load(key: string): Promise<WorkflowData | null> {
    try {
      const fullKey = this.getFullKey(key);
      const serializedData = localStorage.getItem(fullKey);

      if (!serializedData) {
        return null;
      }

      const data = JSON.parse(serializedData) as WorkflowData;
      console.log(`Workflow loaded from localStorage: ${fullKey}`);

      return data;
    } catch (error) {
      console.error('Error loading workflow from localStorage:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
      localStorage.removeItem(`${fullKey}-timestamp`);

      console.log(`Workflow removed from localStorage: ${fullKey}`);
    } catch (error) {
      console.error('Error removing workflow from localStorage:', error);
      throw new Error(`Failed to remove workflow: ${error}`);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      const workflowKeys = keys.filter(key => key.startsWith(this.keyPrefix));

      workflowKeys.forEach(key => localStorage.removeItem(key));

      console.log(`Cleared ${workflowKeys.length} workflow items from localStorage`);
    } catch (error) {
      console.error('Error clearing workflows from localStorage:', error);
      throw new Error(`Failed to clear workflows: ${error}`);
    }
  }

  async getTimestamp(key: string): Promise<string | null> {
    try {
      const fullKey = this.getFullKey(key);
      return localStorage.getItem(`${fullKey}-timestamp`);
    } catch (error) {
      console.error('Error getting timestamp from localStorage:', error);
      return null;
    }
  }

  async listKeys(): Promise<string[]> {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.keyPrefix) && !key.endsWith('-timestamp'))
        .map(key => key.replace(this.keyPrefix, ''));
    } catch (error) {
      console.error('Error listing workflow keys from localStorage:', error);
      return [];
    }
  }

  private getFullKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }
}

export class MemoryWorkflowPersistence implements IWorkflowPersistence {
  private storage: Map<string, WorkflowData> = new Map();
  private timestamps: Map<string, string> = new Map();

  async save(key: string, data: WorkflowData): Promise<void> {
    this.storage.set(key, data);
    this.timestamps.set(key, new Date().toISOString());
    console.log(`Workflow saved to memory: ${key}`);
  }

  async load(key: string): Promise<WorkflowData | null> {
    const data = this.storage.get(key);
    if (data) {
      console.log(`Workflow loaded from memory: ${key}`);
    }
    return data || null;
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
    this.timestamps.delete(key);
    console.log(`Workflow removed from memory: ${key}`);
  }

  async clear(): Promise<void> {
    const count = this.storage.size;
    this.storage.clear();
    this.timestamps.clear();
    console.log(`Cleared ${count} workflow items from memory`);
  }

  async getTimestamp(key: string): Promise<string | null> {
    return this.timestamps.get(key) || null;
  }

  async listKeys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }
}
