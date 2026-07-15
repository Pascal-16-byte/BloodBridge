import { motion } from 'framer-motion';

function AnimatedCard({ children, className = '', delay = 0, hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
      whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
      className={`glass-surface rounded-[32px] border border-white/80 shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedCard;
