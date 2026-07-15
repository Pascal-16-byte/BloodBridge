import { motion } from 'framer-motion';

function SectionTitle({ badge, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45 }}
      className={`max-w-3xl ${alignment}`}
    >
      {badge ? (
        <span className="inline-flex rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          {badge}
        </span>
      ) : null}
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{description}</p> : null}
    </motion.div>
  );
}

export default SectionTitle;
