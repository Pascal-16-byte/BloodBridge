import { motion } from 'framer-motion';

function EmptyState({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-[32px] border border-dashed border-rose-200 bg-white/80 p-10 text-center shadow-soft"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-2xl text-primary">
        B
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold text-text">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </motion.div>
  );
}

export default EmptyState;
