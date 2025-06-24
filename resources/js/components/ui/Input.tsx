/**
 * Input.tsx
 *
 * Reusable input component with consistent styling and validation.
 * Provides base form input component for the workflow canvas.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo, InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

/**
 * Input component with consistent styling and validation states
 * Provides labels, helper text, and error states
 */
export const Input: FC<InputProps> = memo(({
  label,
  helperText,
  errorText,
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  id,
  ...props
}) => {
  const hasError = Boolean(errorText);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const baseInputClasses = `
    bg-white dark:bg-gray-800
    border rounded-md shadow-sm
    transition-colors duration-200
    focus:outline-none focus:ring-1
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `.trim();

  const stateClasses = hasError
    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500';

  const inputClasses = `
    ${baseInputClasses}
    ${sizeClasses[size]}
    ${stateClasses}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `.trim();

  const labelClasses = `
    block text-sm font-medium mb-1
    ${hasError ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'}
  `.trim();

  const helperTextClasses = `
    mt-1 text-xs
    ${hasError ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
  `.trim();

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="w-5 h-5 text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          id={inputId}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="w-5 h-5 text-gray-400 dark:text-gray-500">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {(helperText || errorText) && (
        <p
          id={hasError ? `${inputId}-error` : `${inputId}-help`}
          className={helperTextClasses}
        >
          {errorText || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';