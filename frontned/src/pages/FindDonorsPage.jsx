import { useMemo, useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import AnimatedCard from '../components/common/AnimatedCard';
import BloodBadge from '../components/common/BloodBadge';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import PageHeader from '../components/common/PageHeader';
import SectionTitle from '../components/common/SectionTitle';
import PageTransition from '../components/PageTransition';
import { bloodGroups } from '../constants/bloodGroups';
import { donorDirectory, locationOptions } from '../utils/previewData';

const initialFilters = {
  bloodGroup: '',
  state: '',
  district: '',
  city: '',
};

function SearchIllustration() {
  return (
    <div className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-soft">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[28px] bg-rose-50 p-5">
          <p className="text-sm text-slate-500">Live donor status</p>
          <p className="mt-3 font-display text-2xl font-semibold text-text">8 ready nearby</p>
        </div>
        <div className="rounded-[28px] bg-gradient-to-br from-primary to-secondary p-5 text-white">
          <p className="text-sm text-rose-50/80">Priority match</p>
          <p className="mt-3 font-display text-2xl font-semibold">O- available</p>
        </div>
        <div className="rounded-[28px] bg-[#2d0c0c] p-5 text-white sm:col-span-2">
          <p className="text-sm text-rose-50/75">Search by location and blood group to preview emergency matching.</p>
        </div>
      </div>
    </div>
  );
}

function FilterField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-[22px] border border-rose-200 bg-white px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-rose-100"
      >
        <option value="">All</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}

function FindDonors() {
  const [filters, setFilters] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 4;

  const filteredDonors = useMemo(
    () =>
      donorDirectory.filter((donor) => {
        return (
          (!activeFilters.bloodGroup || donor.bloodGroup === activeFilters.bloodGroup) &&
          (!activeFilters.state || donor.state === activeFilters.state) &&
          (!activeFilters.district || donor.district === activeFilters.district) &&
          (!activeFilters.city || donor.city === activeFilters.city)
        );
      }),
    [activeFilters],
  );

  const totalPages = Math.max(1, Math.ceil(filteredDonors.length / perPage));
  const paginatedDonors = filteredDonors.slice((page - 1) * perPage, page * perPage);

  const handleChange = (field, value) => setFilters((current) => ({ ...current, [field]: value }));

  const handleSearch = () => {
    setLoading(true);
    window.setTimeout(() => {
      setActiveFilters(filters);
      setPage(1);
      setLoading(false);
    }, 750);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setActiveFilters(initialFilters);
    setPage(1);
  };

  return (
    <PageTransition className="bg-surface">
      <PageHeader
        badge="Find Donors"
        title="Search available donors by blood group and location."
        description="This frontend preview shows how users can filter through a donor directory, review availability, and take quick action during emergencies."
        illustration={<SearchIllustration />}
      />

      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-6 lg:px-8">
        <AnimatedCard hover={false} className="p-6 sm:p-8">
          <SectionTitle
            badge="Search"
            title="Refine your donor search"
            description="Use the filters below to preview how donor discovery can work before backend integration."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <FilterField label="Blood Group" value={filters.bloodGroup} onChange={(event) => handleChange('bloodGroup', event.target.value)} options={bloodGroups} />
            <FilterField label="State" value={filters.state} onChange={(event) => handleChange('state', event.target.value)} options={locationOptions.states} />
            <FilterField label="District" value={filters.district} onChange={(event) => handleChange('district', event.target.value)} options={locationOptions.districts} />
            <FilterField label="City" value={filters.city} onChange={(event) => handleChange('city', event.target.value)} options={locationOptions.cities} />
            <div className="flex flex-col justify-end gap-3">
              <PrimaryButton onClick={handleSearch} className="w-full">Search</PrimaryButton>
              <SecondaryButton onClick={resetFilters} className="w-full">Reset</SecondaryButton>
            </div>
          </div>
        </AnimatedCard>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle
            badge="Results"
            title="Available donors"
            description={`${filteredDonors.length} donor${filteredDonors.length === 1 ? '' : 's'} matched your current filters.`}
          />
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-72" />
              ))}
            </div>
          ) : filteredDonors.length === 0 ? (
            <EmptyState
              title="No donors found"
              description="Try clearing one or more filters to widen the search area and see more available donors."
              action={<SecondaryButton onClick={resetFilters}>Clear Filters</SecondaryButton>}
            />
          ) : (
            <>
              <div className="grid gap-6 lg:grid-cols-2">
                {paginatedDonors.map((donor, index) => (
                  <AnimatedCard key={donor.id} delay={index * 0.05} className="p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-display text-2xl font-semibold text-white shadow-glow">
                          {donor.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-display text-2xl font-semibold text-text">{donor.name}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <BloodBadge group={donor.bloodGroup} />
                            <span className="text-sm text-slate-500">{donor.age} years</span>
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {donor.availability}
                      </span>
                    </div>

                    <div className="mt-6 space-y-3 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        {donor.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={16} className="text-primary" />
                        {donor.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail size={16} className="text-primary" />
                        {donor.email}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <SecondaryButton type="button"><Phone size={16} /> Call</SecondaryButton>
                      <SecondaryButton type="button"><Mail size={16} /> Email</SecondaryButton>
                      <PrimaryButton type="button">Request</PrimaryButton>
                    </div>
                  </AnimatedCard>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <SecondaryButton onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                  Previous
                </SecondaryButton>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(index + 1)}
                    className={`h-11 w-11 rounded-full text-sm font-semibold transition ${
                      page === index + 1 ? 'bg-primary text-white shadow-glow' : 'border border-rose-200 bg-white text-slate-700 hover:bg-rose-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <SecondaryButton onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
                  Next
                </SecondaryButton>
              </div>
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
}

export default FindDonors;
