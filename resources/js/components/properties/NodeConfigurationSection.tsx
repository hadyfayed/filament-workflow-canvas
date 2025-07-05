/**
 * NodeConfigurationSection.tsx
 *
 * Configuration section wrapper for node-specific properties.
 * Provides consistent styling and layout for configuration panels.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo, ReactNode } from 'react';

export interface NodeConfigurationSectionProps {
  title?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

/**
 * NodeConfigurationSection component for organizing configuration UI
 * Provides consistent layout and optional collapsible behavior
 */
export const NodeConfigurationSection: FC<NodeConfigurationSectionProps> = memo(
  ({
    title = 'Configuration',
    children,
    collapsible = false,
    defaultCollapsed = false,
    className = '',
  }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    const toggleCollapsed = () => {
      if (collapsible) {
        setIsCollapsed(!isCollapsed);
      }
    };

    return (
      <div className={`border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 pt-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-gray-900 dark:text-white">{title}</h3>
          {collapsible && (
            <button
              onClick={toggleCollapsed}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
            >
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {(!collapsible || !isCollapsed) && <div className="space-y-4">{children}</div>}
      </div>
    );
  }
);

NodeConfigurationSection.displayName = 'NodeConfigurationSection';
