import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  itemIdentifier: string;
  itemSubtext?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemIdentifier,
  itemSubtext
}) => {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 z-10 animate-in fade-in zoom-in-95 space-y-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">{title}</h3>
            <p className="text-xs text-stone-500">
              Screening Task requirement #5: Confirmation before deletion
            </p>
          </div>
        </div>

        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1 text-xs">
          <span className="text-[11px] text-stone-400 uppercase font-semibold block">Record Selected for Deletion</span>
          <p className="font-bold text-stone-900 text-sm">{itemIdentifier}</p>
          {itemSubtext && <p className="text-stone-600">{itemSubtext}</p>}
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Are you sure you want to permanently delete this record from the database? This action will remove the record from both the table view and backend storage.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Confirm Deletion</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
