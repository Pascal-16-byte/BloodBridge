import { motion } from 'framer-motion';

function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const alignment = align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6 }}
      className={`mx-auto mb-12 flex max-w-3xl flex-col ${alignment}`}
    >
      <span className="mb-3 inline-flex rounded-full bg-rose-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
    </motion.div>
  );
}

export default SectionHeading;
