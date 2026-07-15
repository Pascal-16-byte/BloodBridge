export const authTypography = {
  displayTitle: 'font-display text-4xl font-semibold leading-tight text-white sm:text-5xl',
  pageHeading: 'font-display text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl',
  sectionHeading: 'font-display text-xl font-semibold leading-7 text-text',
  body: 'text-sm leading-6 text-slate-600 sm:text-base',
  label: 'text-sm font-medium leading-5 text-slate-700',
  helper: 'text-xs leading-5 text-slate-500',
  caption: 'text-xs font-medium leading-5 text-slate-400',
  error: 'text-sm leading-5 text-primary',
};

export const fieldStyles = {
  wrapper: 'space-y-2',
  control:
    'h-12 w-full rounded-2xl border bg-white/80 px-4 text-sm font-medium text-text outline-none transition duration-200 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
  controlWithLeftIcon: 'pl-12',
  controlWithRightIcon: 'pr-12',
  normal:
    'border-rose-100 shadow-[0_1px_0_rgba(255,255,255,0.65)_inset] hover:border-rose-200 focus:border-primary/50 focus:bg-white focus:shadow-[0_0_0_4px_rgba(229,57,53,0.10)]',
  error:
    'border-primary/60 bg-white shadow-[0_0_0_4px_rgba(229,57,53,0.10)] focus:border-primary',
  icon: 'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400',
  rightIconButton:
    'absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
};

export const cardStyles = {
  base:
    'glass-surface rounded-3xl border border-white/70 shadow-soft transition duration-300',
  interactive: 'hover:-translate-y-0.5 hover:border-rose-100 hover:shadow-glow',
  padding: {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-6 sm:p-8',
  },
};
