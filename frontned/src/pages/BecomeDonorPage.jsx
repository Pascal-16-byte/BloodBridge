import { useState } from 'react';
import { CheckCircle2, HeartHandshake, Mail, Phone, Scale, UserRound } from 'lucide-react';
import PrimaryButton from '../components/buttons/PrimaryButton';
import AnimatedCard from '../components/common/AnimatedCard';
import FeatureCard from '../components/common/FeatureCard';
import PageHeader from '../components/common/PageHeader';
import SectionTitle from '../components/common/SectionTitle';
import SuccessModal from '../components/common/SuccessModal';
import PageTransition from '../components/PageTransition';
import { bloodGroups } from '../constants/bloodGroups';
import { donorBenefits, eligibilityChecklist } from '../utils/previewData';

const initialForm = {
  fullName: '',
  age: '',
  gender: '',
  bloodGroup: '',
  weight: '',
  phone: '',
  email: '',
  address: '',
  lastDonationDate: '',
  medicalConditions: '',
  eligible: false,
};

const inputClassName =
  'w-full rounded-[22px] border border-rose-200 bg-white px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-rose-100';

function DonorIllustration() {
  return (
    <div className="rounded-[36px] border border-white/75 bg-white/85 p-8 shadow-soft">
      <div className="rounded-[30px] bg-gradient-to-br from-primary to-secondary p-6 text-white">
        <HeartHandshake size={28} />
        <p className="mt-5 font-display text-3xl font-semibold">Become a steady source of hope</p>
        <p className="mt-3 text-sm text-rose-50/85">A clear eligibility-first donor flow helps users feel informed before they register.</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[24px] bg-rose-50 p-5">
          <Scale className="text-primary" size={22} />
          <p className="mt-4 font-medium text-text">Weight and health checks</p>
        </div>
        <div className="rounded-[24px] bg-rose-50 p-5">
          <UserRound className="text-primary" size={22} />
          <p className="mt-4 font-medium text-text">Verified donor profile</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function BecomeDonor() {
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
        badge="Become a Donor"
        title="Register as a donor with an eligibility-first experience."
        description="This form is designed to feel safe, professional, and easy to complete for first-time and repeat donors."
        illustration={<DonorIllustration />}
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <AnimatedCard hover={false} className="p-7 sm:p-8">
            <SectionTitle
              badge="Registration"
              title="Donor Registration Form"
              description="All fields are ready for donor onboarding while keeping the experience focused and clear."
            />
            <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
              <Field label="Full Name">
                <input className={inputClassName} value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} required />
              </Field>
              <Field label="Age">
                <input className={inputClassName} type="number" min="18" max="65" value={form.age} onChange={(event) => updateField('age', event.target.value)} required />
              </Field>
              <Field label="Gender">
                <select className={inputClassName} value={form.gender} onChange={(event) => updateField('gender', event.target.value)} required>
                  <option value="">Select gender</option>
                  {['Male', 'Female', 'Other'].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Blood Group">
                <select className={inputClassName} value={form.bloodGroup} onChange={(event) => updateField('bloodGroup', event.target.value)} required>
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Weight">
                <input className={inputClassName} type="number" min="50" value={form.weight} onChange={(event) => updateField('weight', event.target.value)} required />
              </Field>
              <Field label="Phone">
                <input className={inputClassName} value={form.phone} onChange={(event) => updateField('phone', event.target.value)} required />
              </Field>
              <Field label="Email">
                <input className={inputClassName} type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} required />
              </Field>
              <Field label="Last Donation Date">
                <input className={inputClassName} type="date" value={form.lastDonationDate} onChange={(event) => updateField('lastDonationDate', event.target.value)} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Address">
                  <textarea className={`${inputClassName} min-h-24 resize-none`} value={form.address} onChange={(event) => updateField('address', event.target.value)} required />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Medical Conditions">
                  <textarea className={`${inputClassName} min-h-24 resize-none`} value={form.medicalConditions} onChange={(event) => updateField('medicalConditions', event.target.value)} />
                </Field>
              </div>
              <div className="md:col-span-2 rounded-[24px] border border-rose-100 bg-rose-50/70 px-4 py-4">
                <label className="inline-flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.eligible}
                    onChange={(event) => updateField('eligible', event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-rose-300 text-primary focus:ring-primary"
                    required
                  />
                  <span>I confirm I am eligible.</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <PrimaryButton type="submit" className="w-full">Register</PrimaryButton>
              </div>
            </form>
          </AnimatedCard>

          <div className="space-y-6">
            <AnimatedCard delay={0.08} className="p-7">
              <h3 className="font-display text-2xl font-semibold text-text">Eligibility Checklist</h3>
              <div className="mt-5 space-y-3">
                {eligibilityChecklist.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-[22px] bg-rose-50 px-4 py-3 text-sm text-slate-700">
                    <CheckCircle2 className="text-primary" size={18} />
                    {item}
                  </div>
                ))}
              </div>
            </AnimatedCard>

            <div>
              <SectionTitle
                badge="Benefits"
                title="Why donors keep coming back"
                description="A thoughtful experience should show both eligibility guidance and the value of participation."
              />
              <div className="mt-6 grid gap-6">
                {donorBenefits.map((item, index) => (
                  <FeatureCard key={item.title} {...item} delay={index * 0.08} />
                ))}
              </div>
            </div>

            <AnimatedCard delay={0.12} className="p-7">
              <div className="space-y-4 text-sm text-slate-600">
                <p className="flex items-center gap-3"><Phone className="text-primary" size={16} /> Donor support hotline available for onboarding questions.</p>
                <p className="flex items-center gap-3"><Mail className="text-primary" size={16} /> Eligibility updates can later be delivered through email reminders.</p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      <SuccessModal
        open={modalOpen}
        title="Donor Registered"
        description="Your donor registration was submitted successfully in this frontend preview."
        onClose={() => setModalOpen(false)}
      />
    </PageTransition>
  );
}

export default BecomeDonor;
