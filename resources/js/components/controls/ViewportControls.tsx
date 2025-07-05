/**
 * ViewportControls.tsx
 *
 * Viewport control buttons for zoom and fit view operations.
 * Separated for single responsibility and reusability.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo } from 'react';
import { PlusIcon, MinusIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface ViewportControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

/**
 * ViewportControls component for zoom and view operations
 * Provides reusable viewport control buttons
 */
export const ViewportControls: FC<ViewportControlsProps> = memo(
  ({
    onZoomIn,
    onZoomOut,
    onFitView,
    orientation = 'vertical',
    size = 'md',
    showLabels = false,
  }) => {
    const containerClass =
      orientation === 'horizontal' ? 'flex flex-row gap-1' : 'flex flex-col gap-1';
    const sizeClasses = {
      sm: 'p-1',
      md: 'p-2',
      lg: 'p-3',
    };
    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const buttonClass = `${sizeClasses[size]} rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400`;

    return (
      <div className={containerClass}>
        <button
          onClick={onZoomIn}
          className={buttonClass}
          title="Zoom In (Scroll up)"
          aria-label="Zoom In"
        >
          <PlusIcon className={iconSizes[size]} />
          {showLabels && <span className="ml-1 text-xs">Zoom In</span>}
        </button>

        <button
          onClick={onZoomOut}
          className={buttonClass}
          title="Zoom Out (Scroll down)"
          aria-label="Zoom Out"
        >
          <MinusIcon className={iconSizes[size]} />
          {showLabels && <span className="ml-1 text-xs">Zoom Out</span>}
        </button>

        <button
          onClick={onFitView}
          className={buttonClass}
          title="Fit View (Ctrl+0)"
          aria-label="Fit View"
        >
          <HomeIcon className={iconSizes[size]} />
          {showLabels && <span className="ml-1 text-xs">Fit View</span>}
        </button>
      </div>
    );
  }
);

ViewportControls.displayName = 'ViewportControls';
