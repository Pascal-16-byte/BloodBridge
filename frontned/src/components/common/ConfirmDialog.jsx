import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import PrimaryButton from '../buttons/PrimaryButton';

function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', loading = false, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#3c0d0d]/45 px-5 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="w-full max-w-md rounded-[32px] bg-white p-7 shadow-[0_28px_80px_rgba(90,16,16,0.2)]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-primary">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-text">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </div>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <PrimaryButton type="button" onClick={onCancel} className="w-full bg-slate-700 hover:bg-slate-800" disabled={loading}>
                {cancelLabel}
              </PrimaryButton>
              <PrimaryButton type="button" onClick={onConfirm} className="w-full" disabled={loading}>
                {loading ? 'Deleting...' : confirmLabel}
              </PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default ConfirmDialog;
