import { Building2, Clock3, Droplets, MapPin, Phone, UserRound } from 'lucide-react';
import AnimatedCard from '../common/AnimatedCard';
import EmptyState from '../common/EmptyState';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { formatBloodGroup, formatDateTime, formatPostedTime } from '../../services/requestService';

function UrgencyBadge({ value }) {
  const tone = {
    CRITICAL: 'bg-primary text-white',
    HIGH: 'bg-rose-100 text-primary',
    MEDIUM: 'bg-amber-50 text-amber-700',
    LOW: 'bg-sky-50 text-sky-700',
  }[value] || 'bg-rose-50 text-primary';

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{value}</span>;
}

function StatusBadge({ value }) {
  return <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{value}</span>;
}

function RequestFeed({ requests, loading, error }) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-72" />
        ))}
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Unable to load active requests" description={error} />;
  }

  if (requests.length === 0) {
    return <EmptyState title="No active requests found" description="Try clearing the city filter or checking back later for active blood requests." />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {requests.map((request) => (
        <AnimatedCard key={request.id} className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                <Droplets size={15} /> {formatBloodGroup(request.bloodGroup)}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-text">{request.patientName}</h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <UrgencyBadge value={request.urgency} />
              <StatusBadge value={request.status} />
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            <p className="flex items-start gap-3">
              <Building2 className="mt-1 shrink-0 text-primary" size={17} />
              <span>{request.hospitalName}</span>
            </p>
            <p className="flex items-start gap-3">
              <MapPin className="mt-1 shrink-0 text-primary" size={17} />
              <span>{request.city}, {request.district}, {request.state}</span>
            </p>
            <p className="flex items-start gap-3">
              <Clock3 className="mt-1 shrink-0 text-primary" size={17} />
              <span>Posted {formatPostedTime(request.createdAt)} · Required before {formatDateTime(request.requiredBefore)}</span>
            </p>
            <p className="flex items-start gap-3">
              <UserRound className="mt-1 shrink-0 text-primary" size={17} />
              <span>{request.contactPerson}</span>
            </p>
            <p className="flex items-start gap-3">
              <Phone className="mt-1 shrink-0 text-primary" size={17} />
              <span>{request.contactNumber}</span>
            </p>
          </div>

          <div className="mt-6 rounded-[22px] bg-rose-50/80 px-4 py-3 text-sm font-semibold text-text">
            Required units: {request.unitsRequired}
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
}

export default RequestFeed;
