import { motion } from 'framer-motion';

function PrimaryButton({ as: Component = 'button', children, className = '', ...props }) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} className="inline-flex w-full sm:w-auto">
      <Component
        className={`group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-primary px-6 text-sm font-semibold text-white shadow-glow transition duration-300 hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto ${className}`}
        {...props}
      >
        <span className="absolute inset-0 scale-0 rounded-full bg-white/20 transition duration-500 group-hover:scale-150" />
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </Component>
    </motion.div>
  );
}

export default PrimaryButton;
