/**
 * Workflow Service Factory - creates and manages workflow services
 * Following Open/Closed Principle and Factory Pattern
 */

import {
  IWorkflowManager,
  INodeManager,
  IConnectionManager,
  IViewportManager,
  IWorkflowPersistence,
  IWorkflowEventSystem,
} from '../interfaces/IWorkflowManager';

import { WorkflowManagerService } from '../services/WorkflowManagerService';
import { NodeManagerService } from '../services/NodeManagerService';
import { ConnectionManagerService } from '../services/ConnectionManagerService';
import { ViewportManagerService } from '../services/ViewportManagerService';
import {
  LocalStorageWorkflowPersistence,
  MemoryWorkflowPersistence,
} from '../services/WorkflowPersistenceService';
import { WorkflowEventService } from '../services/WorkflowEventService';

export type PersistenceType = 'localStorage' | 'memory' | 'none';

export interface WorkflowServiceConfig {
  persistenceType?: PersistenceType;
  enableEvents?: boolean;
  customPersistence?: IWorkflowPersistence;
  customEventSystem?: IWorkflowEventSystem;
}

export class WorkflowServiceFactory {
  private static instance: WorkflowServiceFactory;
  private services: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): WorkflowServiceFactory {
    if (!WorkflowServiceFactory.instance) {
      WorkflowServiceFactory.instance = new WorkflowServiceFactory();
    }
    return WorkflowServiceFactory.instance;
  }

  createWorkflowManager(config: WorkflowServiceConfig = {}): IWorkflowManager {
    const key = `workflow-manager-${JSON.stringify(config)}`;

    if (this.services.has(key)) {
      return this.services.get(key);
    }

    const persistence = this.createPersistence(config);
    const workflowManager = new WorkflowManagerService(persistence);

    this.services.set(key, workflowManager);
    return workflowManager;
  }

  createNodeManager(): INodeManager {
    const key = 'node-manager';

    if (this.services.has(key)) {
      return this.services.get(key);
    }

    const nodeManager = new NodeManagerService();
    this.services.set(key, nodeManager);
    return nodeManager;
  }

  createConnectionManager(): IConnectionManager {
    const key = 'connection-manager';

    if (this.services.has(key)) {
      return this.services.get(key);
    }

    const connectionManager = new ConnectionManagerService();
    this.services.set(key, connectionManager);
    return connectionManager;
  }

  createViewportManager(): IViewportManager {
    const key = 'viewport-manager';

    if (this.services.has(key)) {
      return this.services.get(key);
    }

    const viewportManager = new ViewportManagerService();
    this.services.set(key, viewportManager);
    return viewportManager;
  }

  createEventSystem(config: WorkflowServiceConfig = {}): IWorkflowEventSystem {
    if (config.enableEvents === false) {
      return this.createNoOpEventSystem();
    }

    if (config.customEventSystem) {
      return config.customEventSystem;
    }

    const key = 'event-system';

    if (this.services.has(key)) {
      return this.services.get(key);
    }

    const eventSystem = new WorkflowEventService();
    this.services.set(key, eventSystem);
    return eventSystem;
  }

  createPersistence(config: WorkflowServiceConfig = {}): IWorkflowPersistence | undefined {
    if (config.customPersistence) {
      return config.customPersistence;
    }

    const persistenceType = config.persistenceType || 'localStorage';

    switch (persistenceType) {
      case 'localStorage':
        return new LocalStorageWorkflowPersistence();
      case 'memory':
        return new MemoryWorkflowPersistence();
      case 'none':
        return undefined;
      default:
        console.warn(`Unknown persistence type: ${persistenceType}. Using localStorage.`);
        return new LocalStorageWorkflowPersistence();
    }
  }

  createAllServices(config: WorkflowServiceConfig = {}): {
    workflowManager: IWorkflowManager;
    nodeManager: INodeManager;
    connectionManager: IConnectionManager;
    viewportManager: IViewportManager;
    eventSystem: IWorkflowEventSystem;
  } {
    return {
      workflowManager: this.createWorkflowManager(config),
      nodeManager: this.createNodeManager(),
      connectionManager: this.createConnectionManager(),
      viewportManager: this.createViewportManager(),
      eventSystem: this.createEventSystem(config),
    };
  }

  clearCache(): void {
    this.services.clear();
  }

  private createNoOpEventSystem(): IWorkflowEventSystem {
    return {
      onNodeAdded: () => {},
      onNodeUpdated: () => {},
      onNodeDeleted: () => {},
      onConnectionCreated: () => {},
      onWorkflowSaved: () => {},
      emit: () => {},
      emitNodeAdded: () => {},
      emitWorkflowSaved: () => {},
      emitNodeUpdated: () => {},
      emitNodeDeleted: () => {},
      emitConnectionCreated: () => {},
    };
  }
}

// Singleton instance for easy access
export const workflowServiceFactory = WorkflowServiceFactory.getInstance();
