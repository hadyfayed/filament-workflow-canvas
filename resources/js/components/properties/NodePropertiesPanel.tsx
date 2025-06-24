/**
 * NodePropertiesPanel.tsx
 *
 * Properties panel for editing workflow nodes using composable components.
 * Built with separated components following SOLID principles.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, useCallback, memo } from 'react';
import { Node } from 'reactflow';
import { useConfirm } from '../../hooks/useConfirm';

// Composed components
import { PropertyPanel } from './PropertyPanel';
import { PropertyPanelHeader } from './PropertyPanelHeader';
import { PropertyPanelFooter } from './PropertyPanelFooter';
import { NodeBasicProperties } from './NodeBasicProperties';
import { NodeConfigurationSection } from './NodeConfigurationSection';

// Node type panels
import { TriggerNodePanel } from '../TriggerNodePanel';
import { ConditionNodePanel } from '../ConditionNodePanel';
import { TransformNodePanel } from '../TransformNodePanel';
import { AnalyticsNodePanel } from '../AnalyticsNodePanel';

// Types and hooks
import { NodeData } from '../../types';
import { useNodeState } from '../../hooks/useNodeState';

export interface NodePropertiesPanelProps {
  node: Node<NodeData>;
  onClose: () => void;
  onNodeUpdate: (node: Node) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeDuplicate: (node: Node) => void;
  position?: 'left' | 'right';
  width?: string;
}

/**
 * NodePropertiesPanel component using composition
 * Combines reusable property panel components
 */
export const NodePropertiesPanel: FC<NodePropertiesPanelProps> = memo(({
  node,
  onClose,
  onNodeUpdate,
  onNodeDelete,
  onNodeDuplicate,
  position = 'right',
  width = 'w-[28rem]'
}) => {
  const { nodeData, updateField, updateConfig } = useNodeState(node, onNodeUpdate);
  const { confirm } = useConfirm();

  const handleDelete = useCallback(async () => {
    await confirm({
      title: 'Delete Node',
      message: 'Are you sure you want to delete this node? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => onNodeDelete(node.id),
    });
  }, [node.id, onNodeDelete, confirm]);

  const handleDuplicate = useCallback(() => {
    onNodeDuplicate(node);
  }, [node, onNodeDuplicate]);

  const renderNodeConfigurationPanel = () => {
    switch (node.type) {
      case 'trigger':
        return <TriggerNodePanel config={nodeData.config} updateConfig={updateConfig} />;
      case 'condition':
        return <ConditionNodePanel config={nodeData.config} updateConfig={updateConfig} />;
      case 'transform':
        return <TransformNodePanel config={nodeData.config} updateConfig={updateConfig} />;
      case 'analytics_driver':
        return <AnalyticsNodePanel config={nodeData.config} updateConfig={updateConfig} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This node type has no properties to configure.
            </p>
          </div>
        );
    }
  };

  const getNodeTypeDisplayName = (type: string) => {
    const typeNames: Record<string, string> = {
      trigger: 'Trigger Node',
      condition: 'Condition Node',
      transform: 'Transform Node',
      analytics_driver: 'Analytics Node'
    };
    return typeNames[type] || 'Unknown Node';
  };

  return (
    <PropertyPanel width={width} position={position}>
      {/* Header */}
      <PropertyPanelHeader
        title={`Edit: ${nodeData.label}`}
        subtitle={getNodeTypeDisplayName(node.type || 'unknown')}
        onClose={onClose}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Basic Properties */}
        <NodeBasicProperties
          nodeId={node.id}
          label={nodeData.label}
          description={nodeData.description}
          onLabelChange={(value) => updateField('label', value)}
          onDescriptionChange={(value) => updateField('description', value)}
        />

        {/* Node-Specific Configuration */}
        <NodeConfigurationSection
          title={`${getNodeTypeDisplayName(node.type || 'unknown')} Configuration`}
          collapsible={true}
          defaultCollapsed={false}
        >
          {renderNodeConfigurationPanel()}
        </NodeConfigurationSection>
      </div>

      {/* Footer */}
      <PropertyPanelFooter
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        deleteLabel="Delete Node"
        duplicateLabel="Duplicate Node"
      />
    </PropertyPanel>
  );
});

NodePropertiesPanel.displayName = 'NodePropertiesPanel';