import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AnimatedCard from '../components/common/AnimatedCard';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionTitle from '../components/common/SectionTitle';
import BloodRequestForm from '../components/requests/BloodRequestForm';
import PrimaryButton from '../components/buttons/PrimaryButton';
import PageTransition from '../components/PageTransition';
import { ROUTES } from '../constants/routes';
import { formatBloodGroup, getBloodRequest, toDateTimeLocal, updateBloodRequest } from '../services/requestService';
import { showErrorToast, showSuccessToast } from '../utils/toast';

function toFormValues(request) {
  return {
    patientName: request.patientName || '',
    bloodGroup: formatBloodGroup(request.bloodGroup),
    unitsRequired: request.unitsRequired || '',
    hospitalName: request.hospitalName || '',
    hospitalAddress: request.hospitalAddress || '',
    city: request.city || '',
    district: request.district || '',
    state: request.state || '',
    contactPerson: request.contactPerson || '',
    contactNumber: request.contactNumber || '',
    urgency: request.urgency || 'HIGH',
    requiredBefore: toDateTimeLocal(request.requiredBefore),
    notes: request.notes || '',
    status: request.status || 'PENDING',
  };
}

function EditRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const initialValues = useMemo(() => (request ? toFormValues(request) : null), [request]);

  const handleSubmit = async (values) => {
    try {
      const updated = await updateBloodRequest(id, values);
      showSuccessToast('Blood request updated successfully.');
      navigate(`/requests/${updated.id}`);
    } catch (apiError) {
      showErrorToast(apiError.message);
    }
  };

  if (loading) {
    return (
      <PageTransition className="bg-surface pt-28">
        <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-6 lg:px-8">
          <LoadingSkeleton className="h-96" />
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
    <PageTransition className="bg-surface pt-28">
      <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to={`/requests/${request.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <ArrowLeft size={17} /> Back to request
          </Link>
          <h1 className="mt-3 font-display text-4xl font-semibold text-text">Edit blood request</h1>
        </div>

        <AnimatedCard hover={false} className="p-7 sm:p-8">
          <SectionTitle badge="Request Details" title={`Update request for ${request.patientName}`} />
          <BloodRequestForm
            initialValues={initialValues}
            submitLabel="Update Request"
            loadingText="Updating..."
            allowStatus
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/requests/${request.id}`)}
          />
        </AnimatedCard>

        <div className="mt-6">
          <PrimaryButton as={Link} to={ROUTES.requests} className="bg-slate-700 hover:bg-slate-800">
            My Requests
          </PrimaryButton>
        </div>
      </section>
    </PageTransition>
  );
}

export default EditRequestPage;
