import { Search, X } from 'lucide-react';

function SearchBar({ value, onChange, placeholder = 'Search', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-full border border-rose-200 bg-white px-11 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-rose-100"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange({ target: { value: '' } })}
          className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-primary"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}

export default SearchBar;
