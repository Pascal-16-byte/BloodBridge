import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import AnimatedCard from './AnimatedCard';

function StatCard({ icon: Icon, label, value, suffix = '', helper, delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.35 });

  return (
    <div ref={ref}>
      <AnimatedCard delay={delay} className="h-full p-6">
        {Icon ? (
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-primary">
            <Icon size={22} />
          </div>
        ) : null}
        <div className="font-display text-4xl font-semibold text-text">
          {typeof value === 'number' ? <CountUp end={inView ? value : 0} duration={2.1} suffix={suffix} /> : value}
        </div>
        <p className="mt-2 text-sm font-medium text-slate-700">{label}</p>
        {helper ? <p className="mt-2 text-xs text-slate-500">{helper}</p> : null}
      </AnimatedCard>
    </div>
  );
}

export default StatCard;
