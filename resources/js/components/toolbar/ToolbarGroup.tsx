/**
 * ToolbarGroup.tsx
 *
 * Toolbar group component for organizing related toolbar items.
 * Provides consistent spacing and layout.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo, ReactNode } from 'react';

export interface ToolbarGroupProps {
  children: ReactNode;
  title?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

/**
 * ToolbarGroup component for organizing toolbar items
 * Provides consistent spacing and optional grouping
 */
export const ToolbarGroup: FC<ToolbarGroupProps> = memo(({
  children,
  title,
  orientation = 'vertical',
  spacing = 'normal',
  className = ''
}) => {
  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col'
  };

  const spacingClasses = {
    tight: 'gap-1',
    normal: 'gap-2',
    loose: 'gap-3'
  };

  const groupClass = `
    ${orientationClasses[orientation]}
    ${spacingClasses[spacing]}
    ${className}
  `.trim();

  return (
    <div className="flex flex-col">
      {title && (
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
          {title}
        </div>
      )}
      <div className={groupClass}>
        {children}
      </div>
    </div>
  );
});

ToolbarGroup.displayName = 'ToolbarGroup';