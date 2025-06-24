import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export function useConfirm() {
    const confirm = useCallback((options: ConfirmOptions) => {
        return new Promise<void>((resolve) => {
            const eventId = uuid();

            const handleConfirmation = (event: Event) => {
                const customEvent = event as CustomEvent;
                if (customEvent.detail.id === eventId) {
                    if (customEvent.detail.confirmed) {
                        options.onConfirm();
                    } else {
                        options.onCancel?.();
                    }
                    window.removeEventListener('workflow-confirmation-response', handleConfirmation);
                    resolve();
                }
            };

            window.addEventListener('workflow-confirmation-response', handleConfirmation);

            window.dispatchEvent(new CustomEvent('workflow-confirmation-request', {
                detail: {
                    id: eventId,
                    title: options.title,
                    message: options.message,
                    confirmText: options.confirmText || 'Confirm',
                    cancelText: options.cancelText || 'Cancel',
                }
            }));
        });
    }, []);

    return { confirm };
} 