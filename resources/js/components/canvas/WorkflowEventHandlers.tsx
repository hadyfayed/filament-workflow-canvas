/**
 * WorkflowEventHandlers.tsx
 *
 * Component for handling workflow canvas events like drag and drop.
 * Separated for better organization and reusability.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, useCallback } from 'react';
import { Node } from 'reactflow';
import { useWorkflowServices } from '../providers/WorkflowProvider';

export interface WorkflowEventHandlersProps {
  onNodesChange: (nodes: Node[]) => void;
  children: React.ReactElement<any>;
  reactFlowInstance: any;
}

/**
 * WorkflowEventHandlers component for handling drag and drop events
 * Wraps ReactFlow with event handling logic
 */
export const WorkflowEventHandlers: FC<WorkflowEventHandlersProps> = ({
  onNodesChange,
  children,
  reactFlowInstance,
}) => {
  const { nodeManager, eventSystem } = useWorkflowServices();

  // Drag and drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (!position) return;

      const newNode = nodeManager.createNode(type, position);

      if (nodeManager.validateNode(newNode)) {
        onNodesChange([newNode]);
        eventSystem.emitNodeAdded(newNode);
      }
    },
    [reactFlowInstance, nodeManager, eventSystem, onNodesChange]
  );

  // Clone the child element and add event handlers
  const childProps = {
    onDrop,
    onDragOver,
    ...children.props,
  };

  return React.cloneElement(children, childProps);
};

WorkflowEventHandlers.displayName = 'WorkflowEventHandlers';
