/**
 * CustomControls.tsx
 *
 * Custom controls using composition of smaller components.
 * Built with separated components following SOLID principles.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo } from 'react';
import { ControlPanel } from './ControlPanel';
import { ViewportControls } from './ViewportControls';
import { WorkflowActions } from './WorkflowActions';

export interface CustomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  isFullScreen: boolean;
  onToggleFullscreen: () => void;
  onSave: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

/**
 * CustomControls component using composition
 * Combines ViewportControls and WorkflowActions in a ControlPanel
 */
export const CustomControls: FC<CustomControlsProps> = memo(
  ({
    onZoomIn,
    onZoomOut,
    onFitView,
    isFullScreen,
    onToggleFullscreen,
    onSave,
    position = 'top-right',
    size = 'md',
    showLabels = false,
    saveStatus = 'idle',
  }) => {
    return (
      <ControlPanel position={position} orientation="vertical">
        {/* Viewport Controls Group */}
        <ViewportControls
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onFitView={onFitView}
          size={size}
          showLabels={showLabels}
        />

        {/* Separator */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>

        {/* Workflow Actions Group */}
        <WorkflowActions
          onSave={onSave}
          onToggleFullscreen={onToggleFullscreen}
          isFullScreen={isFullScreen}
          size={size}
          showLabels={showLabels}
          saveStatus={saveStatus}
        />
      </ControlPanel>
    );
  }
);

CustomControls.displayName = 'CustomControls';
