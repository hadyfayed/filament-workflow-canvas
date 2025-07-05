/**
 * WorkflowAutoSave.tsx
 *
 * Component for handling automatic saving of workflow data.
 * Separated for better organization and control over auto-save behavior.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import { useEffect, FC } from 'react';
import { Node, Edge, Viewport } from 'reactflow';
import { useWorkflowServices } from '../providers/WorkflowProvider';

export interface WorkflowAutoSaveProps {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  onStateChange?: (data: any) => void;
  autoSaveDelay?: number;
  enabled?: boolean;
}

/**
 * WorkflowAutoSave component for automatic saving of workflow state
 * Handles debounced auto-save functionality
 */
export const WorkflowAutoSave: FC<WorkflowAutoSaveProps> = ({
  nodes,
  edges,
  viewport,
  onStateChange,
  autoSaveDelay = 2000,
  enabled = true,
}) => {
  const { workflowManager } = useWorkflowServices();

  useEffect(() => {
    if (!enabled || (nodes.length === 0 && edges.length === 0)) {
      return; // Don't auto-save empty workflows
    }

    const timeoutId = setTimeout(async () => {
      try {
        const workflowData = await workflowManager.saveWorkflow(nodes, edges, viewport);

        // Update local state only (no external saves)
        if (onStateChange) {
          onStateChange(workflowData);
        }

        console.log('Auto-saved workflow data to local state');
      } catch (error) {
        console.error('Error in auto-save:', error);
      }
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, viewport, workflowManager, onStateChange, autoSaveDelay, enabled]);

  // This component only handles auto-save logic, no visual output
  return null;
};

WorkflowAutoSave.displayName = 'WorkflowAutoSave';
