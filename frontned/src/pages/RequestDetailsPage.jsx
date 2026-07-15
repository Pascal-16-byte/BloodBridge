import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Pencil, Phone, Trash2, UserRound } from 'lucide-react';
import AnimatedCard from '../components/common/AnimatedCard';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import PageHeader from '../components/common/PageHeader';
import SectionTitle from '../components/common/SectionTitle';
import PrimaryButton from '../components/buttons/PrimaryButton';
import PageTransition from '../components/PageTransition';
import { ROUTES } from '../constants/routes';
import { deleteBloodRequest, formatBloodGroup, formatDateTime, getBloodRequest } from '../services/requestService';
import { showErrorToast, showSuccessToast } from '../utils/toast';

function Detail({ label, value }) {
  return (
    <div className="rounded-[22px] bg-rose-50/70 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">{label}</p>
      <p className="mt-2 text-sm font-medium text-text">{value || 'Not provided'}</p>
    </div>
  );
}

function RequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRequest() {
      try {
        const data = await getBloodRequest(id);
        if (active) {
          setRequest(data);
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

    loadRequest();
    return () => {
      active = false;
    };
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBloodRequest(id);
      showSuccessToast('Blood request deleted successfully.');
      navigate(ROUTES.requests);
    } catch (apiError) {
      showErrorToast(apiError.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageTransition className="bg-surface pt-28">
        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
          <LoadingSkeleton className="h-80" />
        </section>
      </PageTransition>
    );
  }

  if (error || !request) {
    return (
      <PageTransition className="bg-surface pt-28">
        <section className="mx-auto max-w-3xl px-5 pb-16 sm:px-6 lg:px-8">
          <EmptyState title="Unable to load request" description={error || 'The request could not be found.'} />
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="bg-surface">
      <PageHeader
        badge={request.status}
        title={`${formatBloodGroup(request.bloodGroup)} request for ${request.patientName}`}
        description={`${request.unitsRequired} unit(s) required before ${formatDateTime(request.requiredBefore)}.`}
        actions={
          <>
            <PrimaryButton as={Link} to={ROUTES.requests}><ArrowLeft size={18} /> My Requests</PrimaryButton>
            <PrimaryButton as={Link} to={`/requests/${request.id}/edit`} className="bg-slate-700 hover:bg-slate-800"><Pencil size={18} /> Edit</PrimaryButton>
            <PrimaryButton type="button" onClick={() => setConfirmOpen(true)}><Trash2 size={18} /> Delete</PrimaryButton>
          </>
        }
        illustration={
          <div className="rounded-[36px] border border-white/75 bg-white/85 p-8 shadow-soft">
            <Building2 className="text-primary" size={34} />
            <p className="mt-5 font-display text-3xl font-semibold text-text">{request.hospitalName}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{request.hospitalAddress}</p>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <AnimatedCard hover={false} className="p-7">
            <SectionTitle badge="Patient" title="Patient Information" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Detail label="Patient name" value={request.patientName} />
              <Detail label="Blood group" value={formatBloodGroup(request.bloodGroup)} />
              <Detail label="Units required" value={`${request.unitsRequired} unit(s)`} />
              <Detail label="Urgency" value={request.urgency} />
              <Detail label="Status" value={request.status} />
              <Detail label="Required before" value={formatDateTime(request.requiredBefore)} />
            </div>
          </AnimatedCard>

          <AnimatedCard hover={false} className="p-7">
            <SectionTitle badge="Contact" title="Contact Information" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Detail label="Contact person" value={request.contactPerson} />
              <Detail label="Contact number" value={request.contactNumber} />
              <Detail label="Created by" value={request.createdByName} />
              <Detail label="Created at" value={formatDateTime(request.createdAt)} />
            </div>
          </AnimatedCard>

          <AnimatedCard hover={false} className="p-7">
            <SectionTitle badge="Hospital" title="Hospital and Location" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Detail label="Hospital" value={request.hospitalName} />
              <Detail label="Address" value={request.hospitalAddress} />
              <Detail label="City" value={request.city} />
              <Detail label="District" value={request.district} />
              <Detail label="State" value={request.state} />
            </div>
          </AnimatedCard>

          <AnimatedCard hover={false} className="p-7">
            <SectionTitle badge="Notes" title="Additional Notes" />
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <p className="flex items-center gap-3"><UserRound className="text-primary" size={18} /> {request.notes || 'No additional notes provided.'}</p>
              <p className="flex items-center gap-3"><MapPin className="text-primary" size={18} /> {request.city}, {request.state}</p>
              <p className="flex items-center gap-3"><Phone className="text-primary" size={18} /> {request.contactNumber}</p>
            </div>
          </AnimatedCard>
        </div>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete blood request?"
        description="This action permanently removes the request from your account."
        confirmLabel="Delete Request"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </PageTransition>
  );
}

export default RequestDetailsPage;
