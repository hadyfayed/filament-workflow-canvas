/**
 * WorkflowCanvas.tsx
 *
 * Modern workflow builder canvas for FilamentPHP/ReactFlow.
 * Built with separated components following SOLID principles.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { useCallback, useEffect, FC } from 'react';
import { 
  StateManagerProvider, 
  useStatePath, 
  useStateManager 
} from '../../../react-wrapper/core';
import { ReactFlowProvider, useNodesState, useEdgesState, Node, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';

// Component imports
import { WorkflowProvider, WorkflowServiceConfig } from '../providers/WorkflowProvider';
import { WorkflowCore } from './WorkflowCore';
import { WorkflowBackground } from './WorkflowBackground';
import { WorkflowMiniMap } from './WorkflowMiniMap';
import { WorkflowAutoSave } from './WorkflowAutoSave';
import { KeyboardShortcuts } from '../controls/KeyboardShortcuts';
import { NodePropertiesPanel } from '../properties/NodePropertiesPanel';
import { Toolbar } from '../toolbar/Toolbar';
import { CustomControls } from '../controls/CustomControls';

// Hooks and services
import { 
  useWorkflowManager, 
  useNodeManager, 
  useViewportManager, 
  useWorkflowEventSystem 
} from '../providers/WorkflowProvider';
import { WorkflowData } from '../../interfaces';

export interface WorkflowCanvasProps {
  initialData?: WorkflowData | null;
  onDataChange?: (data: WorkflowData) => void;
  readonly?: boolean;
  showMinimap?: boolean;
  showControls?: boolean;
  autoSave?: boolean;
  serviceConfig?: WorkflowServiceConfig;
}

/**
 * Workflow Canvas Implementation using separated components
 */
const WorkflowCanvasImpl: FC<WorkflowCanvasProps> = ({ 
  initialData = null, 
  onDataChange = null, 
  readonly = false, 
  showMinimap = true, 
  showControls = true,
  autoSave = true
}) => {
  // Services from context
  const workflowManager = useWorkflowManager();
  const nodeManager = useNodeManager();
  const viewportManager = useViewportManager();
  const eventSystem = useWorkflowEventSystem();

  // State management
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useStatePath<Node | null>('selectedNode', null);
  const [isFullScreen, setIsFullScreen] = useStatePath<boolean>('isFullScreen', false);
  const [viewport, setViewport] = useStatePath('viewport', { x: 0, y: 0, zoom: 0.5 });
  const { setState } = useStateManager();
  const reactFlowInstance = useReactFlow();

  // Load initial data using WorkflowManager service
  useEffect(() => {
    if (initialData && initialData.nodes && initialData.nodes.length > 0) {
      const { nodes: reactFlowNodes, edges: reactFlowEdges } = workflowManager.loadWorkflow(initialData);
      
      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
      
      // Set node ID counter based on loaded nodes
      const maxId = Math.max(...reactFlowNodes.map(n => {
        const match = n.id.match(/node_(\\d+)/);
        return match ? parseInt(match[1]) : 0;
      }), 0);
      nodeManager.setNodeIdCounter(maxId + 1);
      
      // Handle viewport
      setTimeout(() => {
        if (reactFlowInstance) {
          if (initialData?.viewport && initialData.viewport.zoom !== 0.5) {
            setViewport(initialData.viewport);
            viewportManager.updateViewport(initialData.viewport);
            reactFlowInstance.setViewport(initialData.viewport);
          } else {
            viewportManager.fitView(reactFlowInstance);
          }
        }
      }, 300);
    } else {
      setTimeout(() => {
        if (reactFlowInstance) {
          viewportManager.fitView(reactFlowInstance);
        }
      }, 300);
    }
  }, [initialData, setNodes, setEdges, setViewport, reactFlowInstance, workflowManager, nodeManager, viewportManager]);

  // Node operations
  const onAddNode = useCallback((type: string) => {
    const position = nodeManager.getNodePosition(type, nodes);
    const newNode = nodeManager.createNode(type, position);
    
    if (nodeManager.validateNode(newNode)) {
      setNodes((nds) => nds.concat(newNode));
      eventSystem.emitNodeAdded(newNode);
      
      setTimeout(() => {
        if (reactFlowInstance) {
          viewportManager.fitView(reactFlowInstance, { duration: 300 });
        }
      }, 100);
    }
  }, [nodeManager, nodes, reactFlowInstance, viewportManager, eventSystem, setNodes]);

  const onNodeClick = useCallback((event: any, node: Node) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Workflow operations
  const saveWorkflow = useCallback(async () => {
    try {
      const workflowData = await workflowManager.saveWorkflow(nodes, edges, viewport);
      
      setState('workflowData', workflowData);
      eventSystem.emitWorkflowSaved(workflowData);
      
      if (onDataChange) {
        onDataChange(workflowData);
      }
      
      // Visual feedback
      const saveButton = document.querySelector('[title=\"Save Workflow\"]') as HTMLElement;
      if (saveButton) {
        saveButton.style.backgroundColor = '#10b981';
        saveButton.style.color = '#ffffff';
        setTimeout(() => {
          saveButton.style.backgroundColor = '';
          saveButton.style.color = '';
        }, 1000);
      }
      
      console.log('Workflow saved successfully:', workflowData);
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  }, [nodes, edges, viewport, workflowManager, eventSystem, setState, onDataChange]);

  // Viewport operations
  const handleZoomIn = useCallback(() => {
    viewportManager.zoomIn(reactFlowInstance);
  }, [reactFlowInstance, viewportManager]);

  const handleZoomOut = useCallback(() => {
    viewportManager.zoomOut(reactFlowInstance);
  }, [reactFlowInstance, viewportManager]);

  const handleFitView = useCallback(() => {
    viewportManager.fitView(reactFlowInstance);
  }, [reactFlowInstance, viewportManager]);

  const toggleFullscreen = useCallback(() => {
    setIsFullScreen((prev: boolean) => !prev);
  }, [setIsFullScreen]);

  const handleViewportChange = useCallback((newViewport: any) => {
    setViewport(newViewport);
  }, [setViewport]);

  // Keyboard shortcuts handlers
  const handleDeleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes(nds => nds.filter(node => node.id !== selectedNode.id));
      setEdges(eds => eds.filter(edge => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges, setSelectedNode]);

  const handleEscape = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Auto-save state change handler
  const handleAutoSaveStateChange = useCallback((data: WorkflowData) => {
    setState('workflowData', data);
  }, [setState]);

  // Node operations for properties panel
  const handleNodeUpdate = useCallback((updatedNode: Node) => {
    setNodes(nds => nds.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
    eventSystem.emitNodeUpdated(updatedNode);
  }, [setNodes, eventSystem]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes(nds => nds.filter(node => node.id !== nodeId));
    setEdges(eds => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
    eventSystem.emitNodeDeleted(nodeId);
  }, [setNodes, setEdges, setSelectedNode, eventSystem]);

  const handleNodeDuplicate = useCallback((originalNode: Node) => {
    const newNode = nodeManager.duplicateNode(originalNode);
    setNodes(nds => nds.concat(newNode));
    eventSystem.emitNodeAdded(newNode);
  }, [nodeManager, setNodes, eventSystem]);

  // Fit view effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (nodes.length > 0 && reactFlowInstance) {
      timer = setTimeout(() => {
        viewportManager.fitView(reactFlowInstance, { duration: 200 });
      }, 400);
    }
    return () => clearTimeout(timer);
  }, [nodes.length, reactFlowInstance, viewportManager]);

  // Canvas layout
  const canvasHeight = isFullScreen ? '100vh' : '600px';
  const canvasClass = isFullScreen
    ? 'fixed inset-0 z-40 bg-white'
    : 'w-full border border-gray-300 rounded-lg bg-white overflow-hidden';

  return (
    <div className={canvasClass} style={{ height: canvasHeight }}>
      {/* Keyboard Shortcuts Handler */}
      <KeyboardShortcuts
        onSave={saveWorkflow}
        onFitView={handleFitView}
        onDeleteSelected={handleDeleteSelected}
        selectedNode={selectedNode}
        onEscape={handleEscape}
      />

      {/* Auto-Save Handler */}
      {autoSave && (
        <WorkflowAutoSave
          nodes={nodes}
          edges={edges}
          viewport={viewport}
          onStateChange={handleAutoSaveStateChange}
        />
      )}

      {/* Main Workflow Canvas */}
      <WorkflowCore
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onViewportChange={handleViewportChange}
        readonly={readonly}
      >
        {/* Background */}
        <WorkflowBackground />

        {/* Controls */}
        {showControls && (
          <CustomControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitView={handleFitView}
            isFullScreen={isFullScreen}
            onToggleFullscreen={toggleFullscreen}
            onSave={saveWorkflow}
          />
        )}

        {/* MiniMap */}
        <WorkflowMiniMap show={showMinimap} />

        {/* Toolbar */}
        <Toolbar onAddNode={onAddNode} />
      </WorkflowCore>

      {/* Properties Panel */}
      {selectedNode && (
        <NodePropertiesPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onNodeUpdate={handleNodeUpdate}
          onNodeDelete={handleNodeDelete}
          onNodeDuplicate={handleNodeDuplicate}
        />
      )}
    </div>
  );
};

/**
 * WorkflowCanvas with all providers
 */
export const WorkflowCanvas: FC<WorkflowCanvasProps> = (props) => {
  return (
    <StateManagerProvider
      initialState={{
        selectedNode: null,
        isFullScreen: false,
        viewport: { x: 0, y: 0, zoom: 0.5 },
        workflowData: props.initialData || { nodes: [], connections: [], viewport: { x: 0, y: 0, zoom: 0.5 } }
      }}
      onStateChange={(state: any) => {
        console.log('State updated:', Object.keys(state));
      }}
    >
      <ReactFlowProvider>
        <WorkflowProvider serviceConfig={props.serviceConfig}>
          <WorkflowCanvasImpl {...props} />
        </WorkflowProvider>
      </ReactFlowProvider>
    </StateManagerProvider>
  );
};

WorkflowCanvas.displayName = 'WorkflowCanvas';