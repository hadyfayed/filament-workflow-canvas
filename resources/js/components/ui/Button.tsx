/**
 * Button.tsx
 *
 * Reusable button component with consistent styling and variants.
 * Provides base UI component for the workflow canvas.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo, ReactNode, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

/**
 * Button component with consistent styling and behavior
 * Provides various sizes, variants, and states
 */
export const Button: FC<ButtonProps> = memo(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
  }) => {
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500',
      secondary:
        'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300 focus:ring-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 dark:border-gray-600',
      danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500',
      success: 'bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500',
      warning:
        'bg-yellow-600 hover:bg-yellow-700 text-white border-transparent focus:ring-yellow-500',
      ghost:
        'bg-transparent hover:bg-gray-100 text-gray-600 border-transparent focus:ring-gray-500 dark:hover:bg-gray-800 dark:text-gray-400',
    };

    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
      xl: 'px-6 py-3 text-base',
    };

    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-5 h-5',
    };

    const baseClasses = `
    inline-flex items-center justify-center
    border font-medium rounded-md
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `.trim();

    const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

    const renderIcon = () => {
      if (loading) {
        return (
          <div className={`animate-spin ${iconSizes[size]}`}>
            <svg viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                className="opacity-75"
              />
            </svg>
          </div>
        );
      }

      if (icon) {
        return <div className={iconSizes[size]}>{icon}</div>;
      }

      return null;
    };

    const hasText = Boolean(children);
    const hasIcon = Boolean(icon || loading);

    return (
      <button className={buttonClasses} disabled={disabled || loading} {...props}>
        {hasIcon && iconPosition === 'left' && (
          <span className={hasText ? 'mr-2' : ''}>{renderIcon()}</span>
        )}

        {children}

        {hasIcon && iconPosition === 'right' && (
          <span className={hasText ? 'ml-2' : ''}>{renderIcon()}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
