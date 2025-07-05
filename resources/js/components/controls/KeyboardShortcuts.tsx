/**
 * KeyboardShortcuts.tsx
 *
 * Component for handling keyboard shortcuts in the workflow canvas.
 * Separated for better organization and reusability.
 *
 * @package @hadyfayed/filament-workflow-canvas
 * @since 1.0.0
 */

import { useEffect, FC } from 'react';
import { Node } from 'reactflow';

export interface KeyboardShortcutsProps {
  onSave?: () => void;
  onFitView?: () => void;
  onDeleteSelected?: () => void;
  selectedNode?: Node | null;
  onEscape?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

/**
 * KeyboardShortcuts component for handling workflow keyboard interactions
 * Provides common keyboard shortcuts for workflow operations
 */
export const KeyboardShortcuts: FC<KeyboardShortcutsProps> = ({
  onSave,
  onFitView,
  onDeleteSelected,
  selectedNode,
  onEscape,
  onUndo,
  onRedo,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      switch (event.key) {
        case 's':
          if (isCtrlOrCmd && onSave) {
            event.preventDefault();
            onSave();
          }
          break;

        case '0':
          if (isCtrlOrCmd && onFitView) {
            event.preventDefault();
            onFitView();
          }
          break;

        case 'Delete':
        case 'Backspace':
          if (selectedNode && onDeleteSelected) {
            event.preventDefault();
            onDeleteSelected();
          }
          break;

        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;

        case 'z':
          if (isCtrlOrCmd) {
            if (event.shiftKey && onRedo) {
              event.preventDefault();
              onRedo();
            } else if (onUndo) {
              event.preventDefault();
              onUndo();
            }
          }
          break;

        case 'y':
          if (isCtrlOrCmd && onRedo) {
            event.preventDefault();
            onRedo();
          }
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onFitView, onDeleteSelected, selectedNode, onEscape, onUndo, onRedo]);

  // This component only handles keyboard events, no visual output
  return null;
};

KeyboardShortcuts.displayName = 'KeyboardShortcuts';
