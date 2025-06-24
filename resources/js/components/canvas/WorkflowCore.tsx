/**
 * WorkflowCore.tsx
 *
 * Core ReactFlow wrapper component with essential workflow functionality.
 * Separated from the main WorkflowCanvas for better organization.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  NodeMouseHandler,
  SelectionMode,
  useReactFlow,
} from 'reactflow';
import { nodeTypes } from '../../nodes';
import { useWorkflowServices } from '../providers/WorkflowProvider';

export interface WorkflowCoreProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onNodeClick?: NodeMouseHandler;
  onPaneClick?: () => void;
  onViewportChange?: (viewport: any) => void;
  readonly?: boolean;
  children?: React.ReactNode;
}

/**
 * WorkflowCore component that wraps ReactFlow with workflow-specific logic
 * Handles connections, validation, and core ReactFlow functionality
 */
export const WorkflowCore: FC<WorkflowCoreProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onPaneClick,
  onViewportChange,
  readonly = false,
  children
}) => {
  const { connectionManager, eventSystem, viewportManager } = useWorkflowServices();
  const reactFlowInstance = useReactFlow();

  // Connection validation using service
  const isValidConnection = useCallback((connection: Connection) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    if (!sourceNode || !targetNode) return false;
    if (!sourceNode.type || !targetNode.type) return false;
    
    return connectionManager.validateConnection(sourceNode.type, targetNode.type);
  }, [nodes, connectionManager]);

  // Connection handler using service
  const onConnect = useCallback((params: Connection) => {
    if (isValidConnection(params)) {
      const newEdge = connectionManager.createConnection(params.source!, params.target!);
      
      // Add the edge using ReactFlow's addEdge utility
      const { addEdge } = require('reactflow');
      onEdgesChange((eds: Edge[]) => addEdge(newEdge, eds));
      
      // Emit connection created event
      eventSystem.emitConnectionCreated(newEdge);
    }
  }, [isValidConnection, connectionManager, eventSystem, onEdgesChange]);

  // Viewport change handler
  const handleViewportChange = useCallback((event: any, newViewport: any) => {
    viewportManager.updateViewport(newViewport);
    if (onViewportChange) {
      onViewportChange(newViewport);
    }
  }, [viewportManager, onViewportChange]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      onMove={handleViewportChange}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      selectionMode={SelectionMode.Partial}
      isValidConnection={isValidConnection}
      minZoom={0.1}
      maxZoom={2}
      defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      style={{ width: '100%', height: '100%' }}
      nodesDraggable={!readonly}
      nodesConnectable={!readonly}
      elementsSelectable={true}
      selectNodesOnDrag={false}
      panOnDrag={true}
      panOnScroll={true}
      zoomOnScroll={true}
      zoomOnPinch={true}
      zoomOnDoubleClick={false}
      deleteKeyCode="Delete"
      multiSelectionKeyCode="Control"
    >
      {children}
    </ReactFlow>
  );
};

WorkflowCore.displayName = 'WorkflowCore';