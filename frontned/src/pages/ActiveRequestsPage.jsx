import { useEffect, useMemo, useState } from 'react';
import { Activity, Filter, MapPin } from 'lucide-react';
import AnimatedCard from '../components/common/AnimatedCard';
import PageHeader from '../components/common/PageHeader';
import RequestFeed from '../components/requests/RequestFeed';
import PageTransition from '../components/PageTransition';
import { getActiveRequestFeed } from '../services/requestService';

const inputClassName =
  'w-full rounded-[22px] border border-rose-200 bg-white px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-rose-100';

function ActiveRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [sort, setSort] = useState('latest');
  const [city, setCity] = useState('');
  const [appliedCity, setAppliedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadFeed() {
      setLoading(true);
      try {
        const data = await getActiveRequestFeed({ sort, city: appliedCity });
        if (active) {
          setRequests(data || []);
          setError('');
        }
      } catch (apiError) {
        if (active) {
          setError(apiError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFeed();
    return () => {
      active = false;
    };
  }, [sort, appliedCity]);

  const cityOptions = useMemo(
    () => Array.from(new Set(requests.map((request) => request.city).filter(Boolean))).sort(),
    [requests],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setAppliedCity(city.trim());
  };

  const clearCity = () => {
    setCity('');
    setAppliedCity('');
  };

  return (
    <PageTransition className="bg-surface">
      <PageHeader
        badge="Active Requests"
        title="Live blood request feed."
        description="Browse active blood requests by latest posting, urgency, and city while keeping request management separate."
        illustration={
          <div className="rounded-[36px] border border-white/75 bg-white/85 p-8 shadow-soft">
            <Activity className="text-primary" size={34} />
            <p className="mt-5 font-display text-3xl font-semibold text-text">{requests.length}</p>
            <p className="mt-2 text-sm text-slate-600">Active requests shown</p>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <AnimatedCard hover={false} className="mb-8 p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[0.7fr_1fr_auto_auto] md:items-end">
            <label>
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Filter size={16} className="text-primary" /> Sort
              </span>
              <select className={inputClassName} value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="latest">Latest</option>
                <option value="urgency">Urgency</option>
              </select>
            </label>

            <label>
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <MapPin size={16} className="text-primary" /> City
              </span>
              <input
                className={inputClassName}
                value={city}
                onChange={(event) => setCity(event.target.value)}
                list="active-request-cities"
                placeholder="Filter by city"
              />
              <datalist id="active-request-cities">
                {cityOptions.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </label>

            <button type="submit" className="h-12 rounded-2xl bg-primary px-6 text-sm font-semibold text-white shadow-glow transition hover:bg-secondary">
              Apply
            </button>
            <button type="button" onClick={clearCity} className="h-12 rounded-2xl bg-slate-700 px-6 text-sm font-semibold text-white transition hover:bg-slate-800">
              Clear
            </button>
          </form>
        </AnimatedCard>

        <RequestFeed requests={requests} loading={loading} error={error} />
      </section>
    </PageTransition>
  );
}

export default ActiveRequestsPage;
