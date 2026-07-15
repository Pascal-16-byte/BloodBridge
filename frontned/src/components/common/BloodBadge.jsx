const toneMap = {
  'O-': 'bg-rose-700 text-white',
  'O+': 'bg-rose-600 text-white',
  'A-': 'bg-rose-100 text-primary',
  'A+': 'bg-emerald-50 text-emerald-700',
  'B-': 'bg-amber-50 text-amber-700',
  'B+': 'bg-sky-50 text-sky-700',
  'AB-': 'bg-violet-50 text-violet-700',
  'AB+': 'bg-fuchsia-50 text-fuchsia-700',
};

function BloodBadge({ group, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneMap[group] || 'bg-rose-100 text-primary'} ${className}`}
    >
      {group}
    </span>
  );
}

export default BloodBadge;
