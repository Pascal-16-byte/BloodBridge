import AnimatedCard from './AnimatedCard';

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <AnimatedCard delay={delay} className="h-full p-7">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-primary">
        <Icon size={22} />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-text">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </AnimatedCard>
  );
}

export default FeatureCard;
