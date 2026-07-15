import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, HeartPulse, Hospital } from 'lucide-react';
import AnimatedCard from '../components/common/AnimatedCard';
import PageHeader from '../components/common/PageHeader';
import SectionTitle from '../components/common/SectionTitle';
import BloodRequestForm from '../components/requests/BloodRequestForm';
import PageTransition from '../components/PageTransition';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { ROUTES } from '../constants/routes';
import { createBloodRequest } from '../services/requestService';
import { showErrorToast, showSuccessToast } from '../utils/toast';

function RequestIllustration() {
  return (
    <div className="rounded-[36px] border border-white/75 bg-white/85 p-8 shadow-soft">
      <div className="grid gap-4">
        <div className="rounded-[28px] bg-gradient-to-br from-primary to-secondary p-6 text-white">
          <HeartPulse size={28} />
          <p className="mt-5 font-display text-2xl font-semibold">Emergency requests need structure</p>
          <p className="mt-2 text-sm text-rose-50/85">Clear patient, hospital, and timing details help the right donors respond faster.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-rose-50 p-5">
            <Hospital className="text-primary" size={22} />
            <p className="mt-4 font-medium text-text">Hospital details</p>
          </div>
          <div className="rounded-[24px] bg-rose-50 p-5">
            <CalendarDays className="text-primary" size={22} />
            <p className="mt-4 font-medium text-text">Required before</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateRequestPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const request = await createBloodRequest(values);
      showSuccessToast('Blood request created successfully.');
      navigate(`/requests/${request.id}`);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  return (
    <PageTransition className="bg-surface">
      <PageHeader
        badge="Request Blood"
        title="Submit a clear emergency blood request."
        description="Create and track your own blood requests with patient, hospital, contact, and urgency details."
        actions={<PrimaryButton as={Link} to={ROUTES.requests}>My Requests</PrimaryButton>}
        illustration={<RequestIllustration />}
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <AnimatedCard hover={false} className="p-7 sm:p-8">
            <SectionTitle badge="Emergency Form" title="Patient and hospital details" />
            <BloodRequestForm submitLabel="Submit Request" loadingText="Submitting..." onSubmit={handleSubmit} />
          </AnimatedCard>

          <div className="space-y-6">
            <AnimatedCard delay={0.08} className="p-7">
              <h3 className="font-display text-2xl font-semibold text-text">Emergency request guidance</h3>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>Include accurate hospital and location details so your saved request stays actionable.</p>
                <p>Use urgency and required-before time to keep coordination priorities clear.</p>
                <p>You can edit, cancel, or delete your own request from My Requests.</p>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.14} className="p-7">
              <h3 className="font-display text-2xl font-semibold text-text">Request ownership</h3>
              <div className="mt-5 grid gap-3">
                {['Only authenticated users can create requests', 'Only request owners can edit', 'Only request owners can delete'].map((item) => (
                  <div key={item} className="rounded-[22px] bg-rose-50 px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default CreateRequestPage;
