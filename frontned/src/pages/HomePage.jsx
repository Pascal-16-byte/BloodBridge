import { motion } from 'framer-motion';
import {
  FiActivity,
  FiArrowRight,
  FiClock,
  FiDroplet,
  FiHeart,
  FiMapPin,
  FiShield,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import heroImage from '../assets/images/blood.jpg';
import { bloodGroups } from '../constants/bloodGroups';
import {
  howItWorks,
  statistics,
  testimonials,
  whyBloodBridge,
} from '../utils/siteData';

const iconMap = {
  verified: FiUserCheck,
  alerts: FiActivity,
  nearby: FiMapPin,
  secure: FiShield,
  available: FiClock,
};

const statIcons = [FiUsers, FiHeart, FiDroplet, FiMapPin];

function HomePage() {
  return (
    <PageTransition>
      <section className="relative min-h-screen overflow-hidden">
        <motion.div
          initial={{ scale: 1.14, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 animate-float bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-hero-fade" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </motion.div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-lg"
            >
              Human-first blood donation for urgent moments
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mt-8 font-display text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl"
            >
              Every Drop Saves a Life.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.75 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-white sm:text-xl"
            >
              BloodBridge helps donors, families, and emergency responders connect quickly through a warm, trusted
              platform designed to turn generosity into life-saving action.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.8 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/donor"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-primary shadow-glow"
                >
                  Become a Donor
                  <FiArrowRight />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/emergency-request"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-lg"
                >
                  Request Blood
                  <FiDroplet />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="mt-14 grid max-w-2xl gap-4 sm:grid-cols-3"
            >
              {[
                'Verified donor network',
                'Emergency response focused',
                'Built for trust and clarity',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/90 backdrop-blur-md">
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 160"
            className="h-24 w-[120%] animate-wave text-surface sm:h-32"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,96L48,101.3C96,107,192,117,288,112C384,107,480,85,576,85.3C672,85,768,107,864,106.7C960,107,1056,85,1152,80C1248,75,1344,85,1392,90.7L1440,96L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z" />
          </svg>
        </div>
      </section>

      <section className="relative bg-surface px-5 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Impact Snapshot"
            title="Built to move hope faster across communities"
            description="Thoughtful design meets real urgency, helping every request, response, and donor match feel calm, clear, and immediate."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {statistics.map((stat, index) => (
              <AnimatedCounter key={stat.label} {...stat} icon={statIcons[index]} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Why BloodBridge"
            title="A platform that feels as compassionate as the people using it"
            description="We’re designing every experience around trust, speed, and the emotional reality of urgent care."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {whyBloodBridge.map((item) => {
              const Icon = iconMap[item.icon];

              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  whileHover={{ y: -8 }}
                  className="rounded-[30px] border border-rose-100 bg-white p-7 shadow-soft"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-primary">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-text">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="How It Works"
            title="Simple steps, life-changing outcomes"
            description="The journey from sign-up to successful donation stays clear and human at every step."
          />
          <div className="grid gap-6 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-[30px] border border-rose-100 bg-surface p-7 shadow-soft"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-display text-xl font-semibold text-white shadow-glow">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Blood Groups"
            title="Find the right donor match with clarity"
            description="Responsive blood group cards give the platform an immediate sense of structure without losing warmth."
          />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 xl:grid-cols-8">
            {bloodGroups.map((group) => (
              <motion.div
                key={group}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-[28px] border border-rose-100 bg-white p-6 text-center shadow-soft"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-display text-2xl font-semibold text-white shadow-glow">
                  {group}
                </div>
                <p className="mt-4 text-sm font-medium text-slate-500">Available network</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Testimonials"
            title="People remember how support felt when time was running out"
            description="The experience should feel composed and reassuring for both donors and families."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="rounded-[32px] border border-rose-100 bg-surface p-8 shadow-soft"
              >
                <div className="mb-6 flex items-center gap-1 text-secondary">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <FiHeart key={starIndex} className="fill-current" />
                  ))}
                </div>
                <p className="text-base leading-8 text-slate-600">“{item.quote}”</p>
                <div className="mt-6">
                  <p className="font-display text-lg font-semibold text-text">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 pt-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-gradient-to-r from-primary via-secondary to-[#c62828] p-10 text-white shadow-glow sm:p-14"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-white/90">
                Join the bridge
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
                Be the reason someone’s family gets one more day together.
              </h2>
              <p className="mt-4 text-base leading-8 text-rose-50/88 sm:text-lg">
                Register as a donor or make an emergency request in a few steps, with a calm experience built for
                moments that matter most.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.04 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-primary"
                >
                  Join Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }}>
                <Link
                  to="/find-donors"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-md"
                >
                  Find Donors
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}

export default HomePage;
