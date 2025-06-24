/**
 * ControlPanel.tsx
 *
 * Generic control panel component that combines different control groups.
 * Follows composition pattern and single responsibility principle.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo, ReactNode } from 'react';
import { Panel } from 'reactflow';

export interface ControlPanelProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  background?: 'solid' | 'blur' | 'transparent';
}

/**
 * ControlPanel component for organizing control elements
 * Provides consistent styling and positioning for control groups
 */
export const ControlPanel: FC<ControlPanelProps> = memo(({
  position = 'top-right',
  className = '',
  children,
  orientation = 'vertical',
  spacing = 'normal',
  background = 'blur'
}) => {
  const positionClasses = {
    'top-left': '!top-4 !left-4',
    'top-right': '!top-4 !right-4',
    'bottom-left': '!bottom-4 !left-4',
    'bottom-right': '!bottom-4 !right-4'
  };

  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col'
  };

  const spacingClasses = {
    tight: 'gap-0.5',
    normal: 'gap-1',
    loose: 'gap-2'
  };

  const backgroundClasses = {
    solid: 'bg-white dark:bg-gray-900',
    blur: 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm',
    transparent: 'bg-transparent'
  };

  const panelClasses = `
    ${orientationClasses[orientation]}
    ${spacingClasses[spacing]}
    ${backgroundClasses[background]}
    border border-gray-200 dark:border-gray-700 
    rounded-xl shadow-xl p-2
    ${className}
  `.trim();

  return (
    <Panel position={position} className={`${positionClasses[position]} z-50`}>
      <div className={panelClasses}>
        {children}
      </div>
    </Panel>
  );
});

ControlPanel.displayName = 'ControlPanel';