import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

function ErrorMessage({ message }) {
  return (
    <AnimatePresence mode="wait">
      {message ? (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-2 flex items-center gap-2 text-sm text-primary"
        >
          <FiAlertCircle size={14} />
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

export default ErrorMessage;
