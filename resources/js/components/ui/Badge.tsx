/**
 * Badge.tsx
 *
 * Reusable badge component for status indicators and labels.
 * Provides consistent styling for small informational elements.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo, ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
}

/**
 * Badge component for status indicators and labels
 * Provides various colors and sizes for different use cases
 */
export const Badge: FC<BadgeProps> = memo(
  ({ children, variant = 'default', size = 'sm', rounded = true, className = '' }) => {
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      secondary: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
      info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200',
    };

    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1.5 text-sm',
      lg: 'px-3 py-2 text-sm',
    };

    const badgeClasses = `
    inline-flex items-center font-medium
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${rounded ? 'rounded-full' : 'rounded-md'}
    ${className}
  `.trim();

    return <span className={badgeClasses}>{children}</span>;
  }
);

Badge.displayName = 'Badge';
