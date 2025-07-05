/**
 * PropertyPanelFooter.tsx
 *
 * Footer component for property panels with action buttons.
 * Separated for reusability and consistent styling.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import React, { FC, memo } from 'react';
import { TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export interface PropertyPanelFooterProps {
  onDelete?: () => void;
  onDuplicate?: () => void;
  deleteLabel?: string;
  duplicateLabel?: string;
  customActions?: React.ReactNode;
  deleteDisabled?: boolean;
  duplicateDisabled?: boolean;
}

/**
 * PropertyPanelFooter component for consistent panel footers
 * Provides delete, duplicate, and custom action buttons
 */
export const PropertyPanelFooter: FC<PropertyPanelFooterProps> = memo(
  ({
    onDelete,
    onDuplicate,
    deleteLabel = 'Delete',
    duplicateLabel = 'Duplicate',
    customActions,
    deleteDisabled = false,
    duplicateDisabled = false,
  }) => {
    return (
      <footer className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={deleteDisabled}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/50 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <TrashIcon className="w-4 h-4" />
              {deleteLabel}
            </button>
          )}
          {customActions}
        </div>

        <div className="flex items-center gap-2">
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              disabled={duplicateDisabled}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
              {duplicateLabel}
            </button>
          )}
        </div>
      </footer>
    );
  }
);

PropertyPanelFooter.displayName = 'PropertyPanelFooter';
