import React, {
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  Loader2,
  X,
} from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  itemType?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<
  DeleteConfirmModalProps
> = ({
  isOpen,
  title,
  itemName,
  itemType = 'item',
  isDeleting = false,
  onConfirm,
  onClose,
}) => {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === 'Escape' &&
          !isDeleting
        ) {
          onClose();
        }
      };

      if (isOpen) {
        window.addEventListener(
          'keydown',
          handleKeyDown
        );
      }

      return () => {
        window.removeEventListener(
          'keydown',
          handleKeyDown
        );
      };
    }, [isOpen, isDeleting, onClose]);

    if (!isOpen) return null;

    const modal = (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        onClick={() => {
          if (!isDeleting) {
            onClose();
          }
        }}
      >
        <div
          className="w-full max-w-md border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-red-500/25 bg-red-500/5 text-red-600 dark:border-red-500/25 dark:bg-red-500/5 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>

              <div>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-red-600 dark:text-red-400">
                  Destructive Action
                </span>

                <h3
                  id="delete-dialog-title"
                  className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]"
                >
                  {title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex h-6 w-6 items-center justify-center text-slate-400 transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-5">
            <p className="text-xs leading-5 text-slate-600 dark:text-[#aeb6c0]">
              Are you sure you want to permanently
              delete{' '}
              <span className="font-semibold text-slate-900 dark:text-[#f4f5f6]">
                "{itemName}"
              </span>
              ?
            </p>

            <div className="mt-4 border-l-2 border-red-500/50 bg-red-50 px-3 py-2.5 dark:bg-red-500/5">
              <p className="text-[10px] leading-4 text-red-700 dark:text-red-300">
                This action cannot be undone and will
                remove all associated {itemType} data.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-[#303841]">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:bg-[#12161b] dark:hover:text-[#f4f5f6]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 border border-red-600 bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/80 dark:bg-red-600 dark:hover:bg-red-700"
            >
              {isDeleting && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}

              <span>
                {isDeleting
                  ? 'Deleting...'
                  : 'Delete'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );

    return createPortal(
      modal,
      document.body
    );
  };

export default DeleteConfirmModal;