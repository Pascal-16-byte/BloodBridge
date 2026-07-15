import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import PrimaryButton from '../buttons/PrimaryButton';

function SuccessModal({ open, title, description, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#3c0d0d]/45 px-5 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="w-full max-w-md rounded-[36px] bg-white p-8 text-center shadow-[0_28px_80px_rgba(90,16,16,0.2)]"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={38} />
            </div>
            <h3 className="mt-6 font-display text-3xl font-semibold text-text">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
            <div className="mt-7 flex justify-center">
              <PrimaryButton onClick={onClose}>Close</PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default SuccessModal;
