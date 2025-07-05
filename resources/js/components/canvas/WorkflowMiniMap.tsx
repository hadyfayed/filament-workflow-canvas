/**
 * WorkflowMiniMap.tsx
 *
 * MiniMap component for the workflow canvas.
 * Separated for customization and conditional rendering.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo } from 'react';
import { MiniMap } from 'reactflow';

export interface WorkflowMiniMapProps {
  show?: boolean;
  className?: string;
  maskColor?: string;
  nodeColor?: string;
  nodeStrokeWidth?: number;
  nodeBorderRadius?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * WorkflowMiniMap component for rendering canvas overview
 * Provides navigation and overview of the entire workflow
 */
export const WorkflowMiniMap: FC<WorkflowMiniMapProps> = memo(
  ({
    show = true,
    className = 'bg-white border border-gray-200 rounded-lg shadow-lg',
    maskColor = 'rgba(0, 0, 0, 0.1)',
    nodeColor = '#e5e7eb',
    nodeStrokeWidth = 2,
    nodeBorderRadius = 4,
    position = 'bottom-right',
  }) => {
    if (!show) {
      return null;
    }

    return (
      <MiniMap
        className={className}
        maskColor={maskColor}
        nodeColor={nodeColor}
        nodeStrokeWidth={nodeStrokeWidth}
        nodeBorderRadius={nodeBorderRadius}
        position={position}
      />
    );
  }
);

WorkflowMiniMap.displayName = 'WorkflowMiniMap';
