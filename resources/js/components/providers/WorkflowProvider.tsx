/**
 * WorkflowProvider.tsx
 *
 * Provider component that manages workflow services using dependency injection.
 * Following SOLID principles and Provider pattern.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { createContext, useContext, useMemo, FC, ReactNode } from 'react';
import { 
  IWorkflowManager, 
  INodeManager, 
  IConnectionManager, 
  IViewportManager, 
  IWorkflowEventSystem 
} from '../../interfaces';
import { workflowServiceFactory, WorkflowServiceConfig } from '../../factories/WorkflowServiceFactory';

export interface WorkflowServices {
  workflowManager: IWorkflowManager;
  nodeManager: INodeManager;
  connectionManager: IConnectionManager;
  viewportManager: IViewportManager;
  eventSystem: IWorkflowEventSystem;
}

interface WorkflowProviderProps {
  children: ReactNode;
  serviceConfig?: WorkflowServiceConfig;
}

const WorkflowContext = createContext<WorkflowServices | null>(null);

/**
 * WorkflowProvider component that provides workflow services to child components
 * Uses dependency injection pattern with service factory
 */
export const WorkflowProvider: FC<WorkflowProviderProps> = ({ 
  children, 
  serviceConfig = {} 
}) => {
  // SOLID: Create services using factory (Dependency Injection)
  const services = useMemo<WorkflowServices>(() => {
    return workflowServiceFactory.createAllServices(serviceConfig);
  }, [serviceConfig]);

  return (
    <WorkflowContext.Provider value={services}>
      {children}
    </WorkflowContext.Provider>
  );
};

/**
 * Hook to access workflow services from context
 * @throws Error if used outside WorkflowProvider
 */
export const useWorkflowServices = (): WorkflowServices => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflowServices must be used within a WorkflowProvider');
  }
  return context;
};

/**
 * Hook to access specific workflow service
 */
export const useWorkflowManager = () => useWorkflowServices().workflowManager;
export const useNodeManager = () => useWorkflowServices().nodeManager;
export const useConnectionManager = () => useWorkflowServices().connectionManager;
export const useViewportManager = () => useWorkflowServices().viewportManager;
export const useWorkflowEventSystem = () => useWorkflowServices().eventSystem;