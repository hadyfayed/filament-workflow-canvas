/**
 * ToolbarContainer.tsx
 *
 * Container component for toolbars with positioning and styling.
 * Provides consistent layout and positioning for toolbar content.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo, ReactNode } from 'react';
import { Panel } from 'reactflow';

export interface ToolbarContainerProps {
  children: ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  orientation?: 'horizontal' | 'vertical';
  title?: string;
  className?: string;
}

/**
 * ToolbarContainer component for consistent toolbar layout
 * Provides positioning and styling for toolbar content
 */
export const ToolbarContainer: FC<ToolbarContainerProps> = memo(({
  children,
  position = 'top-left',
  orientation = 'vertical',
  title,
  className = ''
}) => {
  const positionClasses = {
    'top-left': '!top-1/2 !left-4 !-translate-y-1/2',
    'top-right': '!top-1/2 !right-4 !-translate-y-1/2',
    'bottom-left': '!bottom-1/2 !left-4 !translate-y-1/2',
    'bottom-right': '!bottom-1/2 !right-4 !translate-y-1/2'
  };

  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col'
  };

  const containerClass = `
    ${orientationClasses[orientation]} gap-2
    bg-white dark:bg-gray-900 
    border border-gray-200 dark:border-gray-700 
    rounded-lg shadow-lg p-2
    ${className}
  `.trim();

  return (
    <Panel position={position} className={`${positionClasses[position]} z-50`}>
      <div className={containerClass} role="toolbar" aria-label={title || 'Toolbar'}>
        {title && (
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 px-1">
            {title}
          </div>
        )}
        {children}
      </div>
    </Panel>
  );
});

ToolbarContainer.displayName = 'ToolbarContainer';