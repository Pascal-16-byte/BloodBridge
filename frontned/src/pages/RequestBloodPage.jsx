import { useState } from 'react';
import { CalendarDays, HeartPulse, Hospital, MapPinned, PhoneCall } from 'lucide-react';
import PrimaryButton from '../components/buttons/PrimaryButton';
import AnimatedCard from '../components/common/AnimatedCard';
import PageHeader from '../components/common/PageHeader';
import SectionTitle from '../components/common/SectionTitle';
import SuccessModal from '../components/common/SuccessModal';
import PageTransition from '../components/PageTransition';
import { bloodGroups } from '../constants/bloodGroups';
import { locationOptions } from '../utils/previewData';

const initialForm = {
  patientName: '',
  hospital: '',
  bloodGroup: '',
  units: '',
  city: '',
  district: '',
  state: '',
  requiredDate: '',
  contactNumber: '',
  notes: '',
};

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
            <p className="mt-4 font-medium text-text">Required date</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
        {Icon ? <Icon size={16} className="text-primary" /> : null}
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClassName =
  'w-full rounded-[22px] border border-rose-200 bg-white px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-rose-100';

function RequestBlood() {
  const [form, setForm] = useState(initialForm);
  const [modalOpen, setModalOpen] = useState(false);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setModalOpen(true);
    setForm(initialForm);
  };

  return (
    <PageTransition className="bg-surface">
      <PageHeader
        badge="Request Blood"
        title="Submit a clear emergency blood request."
        description="This professional request flow keeps the most urgent medical details easy to capture, review, and share."
        illustration={<RequestIllustration />}
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <AnimatedCard hover={false} className="p-7 sm:p-8">
            <SectionTitle
              badge="Emergency Form"
              title="Patient and hospital details"
              description="The form is built to feel production-ready for urgent blood request coordination."
            />

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
              <Field label="Patient Name" icon={HeartPulse}>
                <input className={inputClassName} value={form.patientName} onChange={(event) => updateField('patientName', event.target.value)} required />
              </Field>
              <Field label="Hospital" icon={Hospital}>
                <input className={inputClassName} value={form.hospital} onChange={(event) => updateField('hospital', event.target.value)} required />
              </Field>
              <Field label="Blood Group Needed">
                <select className={inputClassName} value={form.bloodGroup} onChange={(event) => updateField('bloodGroup', event.target.value)} required>
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Units Required">
                <input className={inputClassName} type="number" min="1" value={form.units} onChange={(event) => updateField('units', event.target.value)} required />
              </Field>
              <Field label="City" icon={MapPinned}>
                <select className={inputClassName} value={form.city} onChange={(event) => updateField('city', event.target.value)} required>
                  <option value="">Select city</option>
                  {locationOptions.cities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="District">
                <select className={inputClassName} value={form.district} onChange={(event) => updateField('district', event.target.value)} required>
                  <option value="">Select district</option>
                  {locationOptions.districts.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="State">
                <select className={inputClassName} value={form.state} onChange={(event) => updateField('state', event.target.value)} required>
                  <option value="">Select state</option>
                  {locationOptions.states.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Required Date" icon={CalendarDays}>
                <input className={inputClassName} type="date" value={form.requiredDate} onChange={(event) => updateField('requiredDate', event.target.value)} required />
              </Field>
              <Field label="Contact Number" icon={PhoneCall}>
                <input className={inputClassName} value={form.contactNumber} onChange={(event) => updateField('contactNumber', event.target.value)} required />
              </Field>
              <div />
              <div className="md:col-span-2">
                <Field label="Additional Notes">
                  <textarea className={`${inputClassName} min-h-32 resize-none`} value={form.notes} onChange={(event) => updateField('notes', event.target.value)} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <PrimaryButton type="submit" className="w-full">Submit Request</PrimaryButton>
              </div>
            </form>
          </AnimatedCard>

          <div className="space-y-6">
            <AnimatedCard delay={0.08} className="p-7">
              <h3 className="font-display text-2xl font-semibold text-text">Emergency request guidance</h3>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>Include accurate hospital and location details so matching can stay focused and quick.</p>
                <p>Sharing the exact blood group and units required helps reduce unnecessary donor outreach.</p>
                <p>Additional notes can be used for ward details, urgency level, or contact preferences.</p>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.14} className="p-7">
              <h3 className="font-display text-2xl font-semibold text-text">Why this layout works</h3>
              <div className="mt-5 grid gap-3">
                {['Structured for urgent intake', 'Responsive on mobile and desktop', 'Clear enough for hospitals and families'].map((item) => (
                  <div key={item} className="rounded-[22px] bg-rose-50 px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      <SuccessModal
        open={modalOpen}
        title="Request Submitted"
        description="Your emergency blood request has been captured in this frontend preview and is ready for backend integration later."
        onClose={() => setModalOpen(false)}
      />
    </PageTransition>
  );
}

export default RequestBlood;
