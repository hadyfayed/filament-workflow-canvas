/**
 * PropertyPanelHeader.tsx
 *
 * Header component for property panels.
 * Separated for reusability and consistent styling.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface PropertyPanelHeaderProps {
  title: string;
  onClose: () => void;
  subtitle?: string;
  actions?: React.ReactNode;
}

/**
 * PropertyPanelHeader component for consistent panel headers
 * Provides title, close button, and optional actions
 */
export const PropertyPanelHeader: FC<PropertyPanelHeaderProps> = memo(
  ({ title, onClose, subtitle, actions }) => {
    return (
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex-1">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <button
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
            aria-label="Close properties panel"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </header>
    );
  }
);

PropertyPanelHeader.displayName = 'PropertyPanelHeader';
