/**
 * NodeBasicProperties.tsx
 *
 * Basic node properties form (name, description).
 * Separated for reusability across different node types.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo } from 'react';

export interface NodeBasicPropertiesProps {
  nodeId: string;
  label: string;
  description: string;
  onLabelChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  labelLabel?: string;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
  disabled?: boolean;
}

/**
 * NodeBasicProperties component for common node properties
 * Provides label and description fields with consistent styling
 */
export const NodeBasicProperties: FC<NodeBasicPropertiesProps> = memo(
  ({
    nodeId,
    label,
    description,
    onLabelChange,
    onDescriptionChange,
    labelLabel = 'Node Name',
    descriptionLabel = 'Description',
    descriptionPlaceholder = 'Optional: describe the purpose of this node...',
    disabled = false,
  }) => {
    const inputClass = `
    w-full px-3 py-2 
    bg-white dark:bg-gray-800 
    border border-gray-300 dark:border-gray-600 
    rounded-md shadow-sm 
    focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `.trim();

    const labelClass = `
    block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1
  `.trim();

    return (
      <div className="space-y-6">
        <div>
          <label htmlFor={`node-label-${nodeId}`} className={labelClass}>
            {labelLabel}
          </label>
          <input
            id={`node-label-${nodeId}`}
            type="text"
            value={label}
            onChange={e => onLabelChange(e.target.value)}
            className={inputClass}
            disabled={disabled}
            required
            aria-describedby={`node-label-${nodeId}-help`}
          />
          <p
            id={`node-label-${nodeId}-help`}
            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
          >
            A descriptive name for this node
          </p>
        </div>

        <div>
          <label htmlFor={`node-description-${nodeId}`} className={labelClass}>
            {descriptionLabel}
          </label>
          <textarea
            id={`node-description-${nodeId}`}
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder={descriptionPlaceholder}
            disabled={disabled}
            aria-describedby={`node-description-${nodeId}-help`}
          />
          <p
            id={`node-description-${nodeId}-help`}
            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
          >
            Optional description to help explain what this node does
          </p>
        </div>
      </div>
    );
  }
);

NodeBasicProperties.displayName = 'NodeBasicProperties';
