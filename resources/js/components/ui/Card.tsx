/**
 * Card.tsx
 *
 * Reusable card component with consistent styling and layout.
 * Provides base container component for the workflow canvas.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo, ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Card component for consistent container styling
 * Provides header, footer, and content areas with configurable styling
 */
export const Card: FC<CardProps> = memo(({
  children,
  header,
  footer,
  padding = 'md',
  shadow = 'md',
  border = true,
  rounded = 'lg',
  className = ''
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  const cardClasses = `
    bg-white dark:bg-gray-900
    ${border ? 'border border-gray-200 dark:border-gray-700' : ''}
    ${shadowClasses[shadow]}
    ${roundedClasses[rounded]}
    ${className}
  `.trim();

  const headerClasses = `
    ${paddingClasses[padding]}
    border-b border-gray-200 dark:border-gray-700
    ${rounded !== 'none' ? 'rounded-t-' + rounded : ''}
  `.trim();

  const contentClasses = `
    flex-1
    ${header || footer ? '' : paddingClasses[padding]}
  `.trim();

  const footerClasses = `
    ${paddingClasses[padding]}
    border-t border-gray-200 dark:border-gray-700
    ${rounded !== 'none' ? 'rounded-b-' + rounded : ''}
  `.trim();

  return (
    <div className={cardClasses}>
      {header && (
        <div className={headerClasses}>
          {header}
        </div>
      )}
      
      <div className={contentClasses}>
        <div className={header || footer ? paddingClasses[padding] : ''}>
          {children}
        </div>
      </div>
      
      {footer && (
        <div className={footerClasses}>
          {footer}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';