import { motion } from 'framer-motion';

function SecondaryButton({ as: Component = 'button', children, className = '', ...props }) {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-flex w-full sm:w-auto">
      <Component
        className={`inline-flex h-12 w-full items-center justify-center rounded-2xl border border-rose-200 bg-white/90 px-6 text-sm font-semibold text-slate-700 shadow-soft transition duration-300 hover:border-rose-300 hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto ${className}`}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
}

export default SecondaryButton;
