/**
 * NodeTemplate.tsx
 *
 * Individual node template component for the toolbar.
 * Separated for reusability and customization.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo, ReactNode } from 'react';

export interface NodeTemplateProps {
  type: string;
  label: string;
  icon: ReactNode;
  description: string;
  onAdd: (type: string) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

/**
 * NodeTemplate component for individual toolbar items
 * Provides drag and drop functionality and consistent styling
 */
export const NodeTemplate: FC<NodeTemplateProps> = memo(({
  type,
  label,
  icon,
  description,
  onAdd,
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleDragStart = (event: React.DragEvent) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = () => {
    if (!disabled) {
      onAdd(type);
    }
  };

  const buttonClass = `
    flex items-center justify-center ${sizeClasses[size]}
    bg-gray-100 dark:bg-gray-800 
    text-gray-600 dark:text-gray-300 
    rounded-md transition-all duration-200 
    hover:bg-gray-200 dark:hover:bg-gray-700 
    hover:scale-110 active:scale-95 
    focus:outline-none focus:ring-2 focus:ring-blue-400
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
    ${className}
  `.trim();

  return (
    <div className="relative group flex justify-center">
      <button
        onClick={handleClick}
        onDragStart={handleDragStart}
        draggable={!disabled}
        className={buttonClass}
        title={`${label} - ${description}`}
        tabIndex={disabled ? -1 : 0}
        aria-label={`${label}: ${description}`}
        disabled={disabled}
      >
        <div className={iconSizes[size]}>
          {icon}
        </div>
        <span className="sr-only">{label}</span>
      </button>
      
      {/* Enhanced Tooltip */}
      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded px-3 py-2 shadow-xl whitespace-nowrap z-50 flex flex-col gap-1 animate-fade-in min-w-max">
        <div className="font-medium">{label}</div>
        <div className="text-gray-300 dark:text-gray-400 text-xs">{description}</div>
        <svg className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 text-gray-900 dark:text-gray-700" viewBox="0 0 8 8" fill="currentColor">
          <polygon points="8,0 0,4 8,8" />
        </svg>
      </div>
    </div>
  );
});

NodeTemplate.displayName = 'NodeTemplate';