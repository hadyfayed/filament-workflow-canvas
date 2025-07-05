/**
 * WorkflowBackground.tsx
 *
 * Background component for the workflow canvas.
 * Separated for reusability and customization.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo } from 'react';
import { Background, BackgroundVariant } from 'reactflow';

export interface WorkflowBackgroundProps {
  variant?: BackgroundVariant;
  gap?: number;
  size?: number;
  color?: string;
  backgroundColor?: string;
  patternColor?: string;
}

/**
 * WorkflowBackground component for rendering canvas background
 * Provides configurable background patterns and colors
 */
export const WorkflowBackground: FC<WorkflowBackgroundProps> = memo(
  ({
    variant = BackgroundVariant.Dots,
    gap = 20,
    size = 1.5,
    color = '#e5e7eb',
    backgroundColor = '#fafafa',
    patternColor = '#e5e7eb',
  }) => {
    return (
      <Background
        variant={variant}
        gap={gap}
        size={size}
        color={color}
        style={{
          backgroundColor,
          backgroundImage: `radial-gradient(circle at 25px 25px, ${patternColor} 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      />
    );
  }
);

WorkflowBackground.displayName = 'WorkflowBackground';
