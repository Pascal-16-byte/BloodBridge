import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { authTypography } from '../ui/authStyles';

function AuthLayout({ badge, title, description, sideTitle, sideDescription, highlights = [], sideContent, children, compact = false }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-surface px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-mesh opacity-70" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className={`grid w-full gap-6 lg:gap-8 ${compact ? 'mx-auto max-w-3xl' : 'lg:grid-cols-[0.88fr_1.12fr]'}`}>
          <div className="lg:sticky lg:top-8 self-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className={`${compact ? 'hidden' : 'flex'} relative overflow-hidden flex-col justify-between rounded-3xl bg-gradient-to-br from-[#7f1313] via-primary to-secondary p-6 text-white shadow-glow sm:p-8`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_46%)]" />
            <div>
              <Link to="/" className="relative inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 font-display text-lg font-semibold shadow-[0_1px_0_rgba(255,255,255,0.22)_inset]">
                  B
                </div>
                <div>
                  <p className="font-display text-xl font-semibold">BloodBridge</p>
                  <p className="text-sm text-rose-50/70">Every drop saves a life</p>
                </div>
              </Link>

              <div className="relative mt-10 lg:mt-12">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/85">
                  {badge}
                </span>
                <h1 className={`mt-6 ${authTypography.displayTitle}`}>{sideTitle}</h1>
                <p className="mt-6 max-w-md text-base leading-7 text-rose-50/82">{sideDescription}</p>
              </div>
            </div>

            {sideContent ? <div className="relative my-8 hidden lg:block">{sideContent}</div> : null}

            {highlights.length ? (
              <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-rose-50/85 backdrop-blur">
                    {item}
                  </div>
                ))}
              </div>
            ) : null}
          </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: compact ? 0 : 30, y: compact ? 22 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-w-0"
          >
            <Card padding="none" className="overflow-hidden">
              <div className="border-b border-rose-100/80 bg-white/50 px-6 py-6 sm:px-8">
                <span className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  {badge}
                </span>
                <h2 className={`mt-5 ${authTypography.pageHeading}`}>{title}</h2>
                <p className={`mt-4 max-w-2xl ${authTypography.body}`}>{description}</p>
              </div>
              <div className="px-6 py-8 sm:px-8">{children}</div>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
