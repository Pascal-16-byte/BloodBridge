import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

function AnimatedCounter({ end, suffix = '', label, icon: Icon }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div
      ref={ref}
      className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur-md transition duration-300 hover:-translate-y-1"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-primary">
        <Icon size={22} />
      </div>
      <div className="font-display text-4xl font-semibold text-text">
        {inView ? <CountUp end={end} duration={2.4} separator="," /> : 0}
        {suffix}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

export default AnimatedCounter;
