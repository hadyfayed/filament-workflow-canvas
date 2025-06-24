/**
 * WorkflowActions.tsx
 *
 * Action buttons for workflow operations like save and fullscreen.
 * Separated for single responsibility and reusability.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo } from 'react';

export interface WorkflowActionsProps {
  onSave?: () => void;
  onToggleFullscreen?: () => void;
  isFullScreen?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

/**
 * WorkflowActions component for save and fullscreen operations
 * Provides reusable action buttons with status indicators
 */
export const WorkflowActions: FC<WorkflowActionsProps> = memo(({
  onSave,
  onToggleFullscreen,
  isFullScreen = false,
  orientation = 'vertical',
  size = 'md',
  showLabels = false,
  saveStatus = 'idle'
}) => {
  const containerClass = orientation === 'horizontal' ? 'flex flex-row gap-1' : 'flex flex-col gap-1';
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getSaveButtonClass = () => {
    const baseClass = `flex items-center justify-center ${sizeClasses[size]} rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400`;
    
    switch (saveStatus) {
      case 'saving':
        return `${baseClass} bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 cursor-wait`;
      case 'saved':
        return `${baseClass} bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300`;
      case 'error':
        return `${baseClass} bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400`;
      default:
        return `${baseClass} bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40`;
    }
  };

  const fullscreenButtonClass = `flex items-center justify-center ${sizeClasses[size]} rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400`;

  return (
    <div className={containerClass}>
      {onSave && (
        <button
          className={getSaveButtonClass()}
          title="Save Workflow (Ctrl+S)"
          aria-label="Save Workflow"
          onClick={onSave}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? (
            <div className={`animate-spin ${iconSizes[size]}`}>
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/>
              </svg>
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconSizes[size]}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"></path>
            </svg>
          )}
          {showLabels && (
            <span className="ml-1 text-xs">
              {saveStatus === 'saving' ? 'Saving...' : 'Save'}
            </span>
          )}
        </button>
      )}
      
      {onToggleFullscreen && (
        <button
          className={fullscreenButtonClass}
          title={isFullScreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen (F11)'}
          aria-label={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          onClick={onToggleFullscreen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconSizes[size]}>
            {isFullScreen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9V4.5M15 9h4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15v4.5M15 15h4.5m0 0l5.25 5.25"/>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
            )}
          </svg>
          {showLabels && (
            <span className="ml-1 text-xs">
              {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </span>
          )}
        </button>
      )}
    </div>
  );
});

WorkflowActions.displayName = 'WorkflowActions';