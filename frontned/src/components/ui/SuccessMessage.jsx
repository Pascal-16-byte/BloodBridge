import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

function SuccessMessage({ message }) {
  return (
    <AnimatePresence mode="wait">
      {message ? (
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          <FiCheckCircle className="mt-0.5" size={18} />
          <span>{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default SuccessMessage;
