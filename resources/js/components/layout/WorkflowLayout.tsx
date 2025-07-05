/**
 * WorkflowLayout.tsx
 *
 * Layout component that organizes all workflow UI elements.
 * Provides consistent positioning and responsive behavior.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, ReactNode } from 'react';

export interface WorkflowLayoutProps {
  children: ReactNode;
  isFullScreen?: boolean;
  className?: string;
  height?: string;
}

/**
 * WorkflowLayout component for consistent workflow UI layout
 * Handles fullscreen mode and responsive behavior
 */
export const WorkflowLayout: FC<WorkflowLayoutProps> = ({
  children,
  isFullScreen = false,
  className = '',
  height = '600px',
}) => {
  const canvasHeight = isFullScreen ? '100vh' : height;
  const canvasClass = isFullScreen
    ? 'fixed inset-0 z-40 bg-white dark:bg-gray-900'
    : 'w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 overflow-hidden';

  return (
    <div
      className={`${canvasClass} ${className}`}
      style={{ height: canvasHeight }}
      role="application"
      aria-label="Workflow Canvas"
    >
      {children}
    </div>
  );
};

WorkflowLayout.displayName = 'WorkflowLayout';
