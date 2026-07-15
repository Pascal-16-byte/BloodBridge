import { motion } from 'framer-motion';

function PageHeader({ badge, title, description, actions, illustration, className = '' }) {
  return (
    <section className={`relative overflow-hidden pt-28 ${className}`}>
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          {badge ? (
            <span className="inline-flex w-fit rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {badge}
            </span>
          ) : null}
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-600 sm:text-base">{description}</p>
          {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative"
        >
          {illustration}
        </motion.div>
      </div>
    </section>
  );
}

export default PageHeader;
