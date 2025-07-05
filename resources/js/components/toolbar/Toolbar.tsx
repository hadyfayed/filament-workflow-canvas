/**
 * Toolbar.tsx
 *
 * Toolbar using composition and service integration.
 * Built with separated components following SOLID principles.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo, useMemo } from 'react';
import {
  BoltIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

// Composed components
import { ToolbarContainer } from './ToolbarContainer';
import { ToolbarGroup } from './ToolbarGroup';
import { NodeTemplate } from './NodeTemplate';

// Service integration
import { useConnectionManager } from '../providers/WorkflowProvider';

export interface ToolbarProps {
  onAddNode: (type: string) => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showNodeTypes?: string[];
  groupByCategory?: boolean;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
}

interface NodeTemplateConfig {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

/**
 * Toolbar component using composition and services
 * Provides dynamic node templates based on connection manager rules
 */
export const Toolbar: FC<ToolbarProps> = memo(
  ({
    onAddNode,
    position = 'top-left',
    showNodeTypes,
    groupByCategory = false,
    size = 'md',
    title = 'Node Templates',
  }) => {
    const connectionManager = useConnectionManager();

    // Get available node types from connection manager
    const availableNodeTypes = useMemo(() => {
      const connectionRules = connectionManager.getConnectionRules();
      return Object.keys(connectionRules);
    }, [connectionManager]);

    // All possible node templates
    const allNodeTemplates: NodeTemplateConfig[] = useMemo(
      () => [
        {
          type: 'trigger',
          label: 'Trigger',
          icon: (
            <BoltIcon
              className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
            />
          ),
          description: 'Listens for incoming events',
          category: 'Input',
        },
        {
          type: 'condition',
          label: 'Condition',
          icon: (
            <MagnifyingGlassIcon
              className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
            />
          ),
          description: 'Filters events based on conditions',
          category: 'Logic',
        },
        {
          type: 'transform',
          label: 'Transform',
          icon: (
            <ArrowPathIcon
              className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
            />
          ),
          description: 'Transforms event data',
          category: 'Processing',
        },
        {
          type: 'analytics_driver',
          label: 'Analytics',
          icon: (
            <ChartBarIcon
              className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
            />
          ),
          description: 'Sends data to analytics platform',
          category: 'Output',
        },
      ],
      [size]
    );

    // Filter templates based on available types and showNodeTypes prop
    const filteredTemplates = useMemo(() => {
      return allNodeTemplates.filter(template => {
        const isAvailable = availableNodeTypes.includes(template.type);
        const isAllowed = !showNodeTypes || showNodeTypes.includes(template.type);
        return isAvailable && isAllowed;
      });
    }, [allNodeTemplates, availableNodeTypes, showNodeTypes]);

    // Group templates by category if requested
    const groupedTemplates = useMemo(() => {
      if (!groupByCategory) {
        return { All: filteredTemplates };
      }

      return filteredTemplates.reduce(
        (groups, template) => {
          const category = template.category;
          if (!groups[category]) {
            groups[category] = [];
          }
          groups[category].push(template);
          return groups;
        },
        {} as Record<string, NodeTemplateConfig[]>
      );
    }, [filteredTemplates, groupByCategory]);

    const renderTemplateGroup = (templates: NodeTemplateConfig[], groupTitle?: string) => (
      <ToolbarGroup
        key={groupTitle || 'default'}
        title={groupByCategory ? groupTitle : undefined}
        spacing="normal"
      >
        {templates.map(template => (
          <NodeTemplate
            key={template.type}
            type={template.type}
            label={template.label}
            icon={template.icon}
            description={template.description}
            onAdd={onAddNode}
            size={size}
          />
        ))}
      </ToolbarGroup>
    );

    return (
      <ToolbarContainer position={position} orientation="vertical" title={title}>
        {Object.entries(groupedTemplates).map(([groupTitle, templates]) =>
          renderTemplateGroup(templates, groupTitle)
        )}

        {filteredTemplates.length === 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 p-2 text-center">
            No node types available
          </div>
        )}
      </ToolbarContainer>
    );
  }
);

Toolbar.displayName = 'Toolbar';
