import { HeartPulse, ShieldPlus, Syringe, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrimaryButton from '../components/buttons/PrimaryButton';
import AnimatedCard from '../components/common/AnimatedCard';
import FeatureCard from '../components/common/FeatureCard';
import PageHeader from '../components/common/PageHeader';
import SectionTitle from '../components/common/SectionTitle';
import StatCard from '../components/common/StatCard';
import PageTransition from '../components/PageTransition';
import { aboutFeatures, aboutMission, aboutStats, aboutSteps, teamMembers } from '../utils/previewData';

function HeroIllustration() {
  const icons = [HeartPulse, Syringe, ShieldPlus, UsersRound];

  return (
    <div className="relative mx-auto flex max-w-xl items-center justify-center">
      <div className="absolute -left-4 top-10 h-28 w-28 rounded-full bg-rose-100 blur-3xl" />
      <div className="absolute -right-2 bottom-10 h-36 w-36 rounded-full bg-red-100 blur-3xl" />
      <div className="relative w-full rounded-[36px] border border-white/80 bg-white/85 p-8 shadow-soft backdrop-blur">
        <div className="grid grid-cols-2 gap-4">
          {icons.map((Icon, index) => (
            <div
              key={index}
              className={`rounded-[28px] p-6 ${
                index === 0 || index === 3 ? 'bg-gradient-to-br from-primary to-secondary text-white' : 'bg-rose-50 text-primary'
              }`}
            >
              <Icon size={30} />
              <p className="mt-8 font-display text-lg font-semibold">Care that moves faster</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-[28px] bg-[#2d0c0c] p-5 text-white">
          <p className="text-sm text-rose-50/80">Emergency Response Network</p>
          <p className="mt-2 font-display text-3xl font-semibold">24/7 donor coordination</p>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <PageTransition className="bg-surface">
      <PageHeader
        badge="About BloodBridge"
        title="Built to make urgent blood support feel clear, fast, and deeply human."
        description="BloodBridge is a modern blood donation and emergency request experience designed to reduce friction when patients, donors, hospitals, and volunteers need to act quickly together."
        actions={<PrimaryButton as={Link} to="/register">Register Now</PrimaryButton>}
        illustration={<HeroIllustration />}
      />

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Mission"
          title="A healthcare experience rooted in trust and urgency"
          description="Every section of BloodBridge is shaped around the same goal: helping people move from panic to action with confidence."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {aboutMission.map((item, index) => (
            <AnimatedCard key={item.title} delay={index * 0.08} className="p-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-primary">
                <item.icon size={26} />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-text">{item.title}</h3>
              <p className="mt-3 text-sm leading-8 text-slate-600">{item.description}</p>
            </AnimatedCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <SectionTitle
          badge="How It Works"
          title="A simple path from registration to life-saving action"
          description="The platform keeps each step focused so users can move quickly, even during stressful moments."
          align="center"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {aboutSteps.map((item, index) => (
            <AnimatedCard key={item.title} delay={index * 0.08} className="relative p-7">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/60">{item.step}</span>
              <div className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-glow">
                <item.icon size={22} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-text">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </AnimatedCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Statistics"
          title="The impact a connected donor network can create"
          description="These preview metrics show how BloodBridge can present credibility and community momentum."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {aboutStats.map((item, index) => (
            <StatCard key={item.label} {...item} delay={index * 0.08} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Why Choose Us"
          title="Designed for healthcare urgency without sacrificing warmth"
          description="BloodBridge blends speed, reliability, and community care into a frontend experience that feels professional on every screen."
          align="center"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {aboutFeatures.map((item, index) => (
            <FeatureCard key={item.title} {...item} delay={index * 0.08} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Team"
          title="The people behind the platform vision"
          description="A mission-first team can help the product feel both medically credible and emotionally reassuring."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {teamMembers.map((member, index) => (
            <AnimatedCard key={member.name} delay={index * 0.08} className="p-7">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-display text-2xl font-semibold text-white shadow-glow">
                {member.name.charAt(0)}
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-text">{member.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">{member.description}</p>
            </AnimatedCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-primary via-secondary to-[#c62828] p-10 text-white shadow-glow sm:p-14">
          <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-rose-50">
            Become a Hero Today
          </span>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-semibold sm:text-4xl">
            Join the network that helps care reach people faster.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-rose-50/88 sm:text-base">
            Whether you want to donate, coordinate, or respond during emergencies, your support can become someone else's turning point.
          </p>
          <div className="mt-8">
            <PrimaryButton as={Link} to="/register" className="bg-white text-primary hover:bg-rose-50">
              Register Now
            </PrimaryButton>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default About;
