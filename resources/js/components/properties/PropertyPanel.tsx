/**
 * PropertyPanel.tsx
 *
 * Generic property panel layout component.
 * Provides consistent structure and styling for all property panels.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo, ReactNode } from 'react';

export interface PropertyPanelProps {
  children: ReactNode;
  width?: string;
  position?: 'left' | 'right';
  className?: string;
}

/**
 * PropertyPanel component for consistent panel layout
 * Provides the basic structure for property editing panels
 */
export const PropertyPanel: FC<PropertyPanelProps> = memo(
  ({ children, width = 'w-[28rem]', position = 'right', className = '' }) => {
    const positionClasses = {
      left: 'left-0 border-r',
      right: 'right-0 border-l',
    };

    const panelClasses = `
    fixed top-0 ${positionClasses[position]} ${width} h-full 
    bg-white dark:bg-gray-900 
    shadow-xl z-50 flex flex-col 
    border-gray-200 dark:border-gray-700
    ${className}
  `.trim();

    return (
      <div className={panelClasses} role="dialog" aria-modal="true">
        {children}
      </div>
    );
  }
);

PropertyPanel.displayName = 'PropertyPanel';
