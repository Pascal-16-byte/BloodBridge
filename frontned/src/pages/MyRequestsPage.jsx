import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Eye, FilePlus2, Pencil, Trash2 } from 'lucide-react';
import AnimatedCard from '../components/common/AnimatedCard';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import PageHeader from '../components/common/PageHeader';
import PrimaryButton from '../components/buttons/PrimaryButton';
import PageTransition from '../components/PageTransition';
import { ROUTES } from '../constants/routes';
import { deleteBloodRequest, formatBloodGroup, formatDateTime, getBloodRequests } from '../services/requestService';
import { showErrorToast, showSuccessToast } from '../utils/toast';

function StatusBadge({ value }) {
  const tone = {
    PENDING: 'bg-amber-50 text-amber-700',
    ACTIVE: 'bg-sky-50 text-sky-700',
    FULFILLED: 'bg-emerald-50 text-emerald-700',
    CANCELLED: 'bg-slate-100 text-slate-600',
  }[value] || 'bg-rose-50 text-primary';

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{value}</span>;
}

function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getBloodRequests();
      setRequests(data || []);
      setError('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);
    try {
      await deleteBloodRequest(deleteTarget.id);
      showSuccessToast('Blood request deleted successfully.');
      setDeleteTarget(null);
      await loadRequests();
    } catch (apiError) {
      showErrorToast(apiError.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageTransition className="bg-surface">
      <PageHeader
        badge="My Requests"
        title="Manage your blood requests."
        description="View, update, or delete the blood requests created from your authenticated account."
        actions={<PrimaryButton as={Link} to={ROUTES.requestBlood}><FilePlus2 size={18} /> Create Request</PrimaryButton>}
        illustration={
          <div className="rounded-[36px] border border-white/75 bg-white/85 p-8 shadow-soft">
            <CalendarClock className="text-primary" size={34} />
            <p className="mt-5 font-display text-3xl font-semibold text-text">{requests.length}</p>
            <p className="mt-2 text-sm text-slate-600">Total saved requests</p>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-56" />
            ))}
          </div>
        ) : error ? (
          <EmptyState title="Unable to load requests" description={error} />
        ) : requests.length === 0 ? (
          <EmptyState
            title="No blood requests yet"
            description="Create your first request to start tracking patient, hospital, urgency, and status details."
            action={<PrimaryButton as={Link} to={ROUTES.requestBlood}>Create Request</PrimaryButton>}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {requests.map((request) => (
              <AnimatedCard key={request.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">{formatBloodGroup(request.bloodGroup)}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-text">{request.patientName}</h3>
                  </div>
                  <StatusBadge value={request.status} />
                </div>
                <div className="mt-5 space-y-2 text-sm leading-7 text-slate-600">
                  <p>{request.unitsRequired} unit(s) required at {request.hospitalName}</p>
                  <p>{request.city}, {request.state}</p>
                  <p>Before {formatDateTime(request.requiredBefore)}</p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  <PrimaryButton as={Link} to={`/requests/${request.id}`} className="h-11 px-3">
                    <Eye size={16} />
                  </PrimaryButton>
                  <PrimaryButton as={Link} to={`/requests/${request.id}/edit`} className="h-11 px-3 bg-slate-700 hover:bg-slate-800">
                    <Pencil size={16} />
                  </PrimaryButton>
                  <PrimaryButton type="button" onClick={() => setDeleteTarget(request)} className="h-11 px-3">
                    <Trash2 size={16} />
                  </PrimaryButton>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete blood request?"
        description={`This will permanently delete the request for ${deleteTarget?.patientName || 'this patient'}.`}
        confirmLabel="Delete Request"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageTransition>
  );
}

export default MyRequestsPage;
