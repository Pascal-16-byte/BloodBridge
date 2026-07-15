import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { ROUTES } from '../constants/routes';

function NotFoundPage() {
  return (
    <PageTransition className="bg-surface pt-28">
      <section className="px-5 pb-24 pt-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl rounded-[36px] border border-rose-100 bg-white/80 p-10 shadow-soft backdrop-blur-xl sm:p-14"
        >
          <span className="inline-flex rounded-full bg-rose-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            404
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            This page couldn't be found
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            The route you tried does not exist yet, but the rest of BloodBridge is right here and ready to explore.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to={ROUTES.home}
              className="rounded-full bg-primary px-6 py-3 font-medium text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-secondary"
            >
              Back to Home
            </Link>
            <Link
              to={ROUTES.register}
              className="rounded-full border border-rose-200 px-6 py-3 font-medium text-slate-700 transition hover:border-rose-300 hover:bg-rose-50"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}

export default NotFoundPage;
