/**
 * nodes.tsx
 *
 * Contains all custom node components for the Workflow Canvas (FilamentPHP/ReactFlow).
 * Exports: BaseNode, TriggerNode, ConditionNode, TransformNode, AnalyticsNode, nodeTypes
 */

import React, { FC } from 'react';
import { Handle, Position } from 'reactflow';
import {
  ArrowPathIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

// Types
export interface NodeData {
  label: string;
  config?: Record<string, any>;
  description?: string;
  hasError?: boolean;
}
export interface BaseNodeProps {
  data: NodeData;
  selected: boolean;
  type: string;
  icon: React.ReactNode;
  color: 'primary' | 'warning' | 'purple' | 'success';
  children?: React.ReactNode;
  hasInput?: boolean;
  hasOutput?: boolean;
}
export interface CustomNodeProps {
  data: NodeData;
  selected: boolean;
}

/**
 * BaseNode - shared node UI for all node types
 */
export const BaseNode: FC<BaseNodeProps> = ({ data, selected, type, icon, color, children, hasInput = true, hasOutput = true }) => {
  const getBorderClasses = () => {
    if (data.hasError) return 'border-danger-500 dark:border-danger-400 ring-2 ring-danger-500/50';
    if (selected) {
      switch (color) {
        case 'primary': return 'border-primary-500 dark:border-primary-400 ring-2 ring-primary-500/50';
        case 'warning': return 'border-warning-500 dark:border-warning-400 ring-2 ring-warning-500/50';
        case 'purple': return 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/50';
        case 'success': return 'border-success-500 dark:border-success-400 ring-2 ring-success-500/50';
      }
    }
    return 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500';
  };
  const getIconBgClasses = (): string => {
    const colors = {
      primary: 'bg-primary-500/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-400',
      warning: 'bg-warning-500/10 text-warning-600 dark:bg-warning-400/10 dark:text-warning-400',
      purple: 'bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400',
      success: 'bg-success-500/10 text-success-600 dark:bg-success-400/10 dark:text-success-400'
    };
    return colors[color] || 'bg-gray-500/10 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400';
  };
  return (
    <div className={`relative px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 transition-all duration-200 min-w-[220px] shadow-sm hover:shadow-md ${getBorderClasses()}`}>
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-2.5 !h-2.5 !bg-gray-300 dark:!bg-gray-600 !border-2 !border-white dark:!border-gray-800 hover:!bg-primary-400"
        />
      )}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-2.5 !h-2.5 !bg-gray-300 dark:!bg-gray-600 !border-2 !border-white dark:!border-gray-800 hover:!bg-primary-400"
        />
      )}
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${getIconBgClasses()} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">{data.label}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{type}</div>
        </div>
        {data.hasError && (
          <ExclamationCircleIcon className="w-6 h-6 text-danger-500" />
        )}
      </div>
      {data.description && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">{data.description}</div>
      )}
      {children}
    </div>
  );
};

/**
 * TriggerNode - for event triggers
 */
export const TriggerNode: FC<CustomNodeProps> = ({ data, selected }) => (
  <BaseNode data={data} selected={selected} type="Trigger" icon={<BoltIcon className="w-6 h-6"/>} color="primary" hasInput={false} />
);

/**
 * ConditionNode - for filter/condition nodes
 */
export const ConditionNode: FC<CustomNodeProps> = ({ data, selected }) => (
  <BaseNode data={data} selected={selected} type="Condition" icon={<MagnifyingGlassIcon className="w-6 h-6"/>} color="warning" />
);

/**
 * TransformNode - for transformation nodes
 */
export const TransformNode: FC<CustomNodeProps> = ({ data, selected }) => (
  <BaseNode data={data} selected={selected} type="Transform" icon={<ArrowPathIcon className="w-6 h-6"/>} color="purple" />
);

/**
 * AnalyticsNode - for analytics driver nodes
 */
export const AnalyticsNode: FC<CustomNodeProps> = ({ data, selected }) => (
  <BaseNode data={data} selected={selected} type="Analytics" icon={<ChartBarIcon className="w-6 h-6"/>} color="success" hasOutput={false} />
);

/**
 * nodeTypes - mapping for ReactFlow
 */
export const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  transform: TransformNode,
  analytics_driver: AnalyticsNode,
}; 