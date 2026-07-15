import { useState } from 'react';
import { Clock3, Mail, MapPin, Phone, Send } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import PrimaryButton from '../components/buttons/PrimaryButton';
import AnimatedCard from '../components/common/AnimatedCard';
import PageHeader from '../components/common/PageHeader';
import SectionTitle from '../components/common/SectionTitle';
import SuccessModal from '../components/common/SuccessModal';
import PageTransition from '../components/PageTransition';
import { contactDetails, socialLinks } from '../utils/previewData';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const socialIconMap = {
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
  Facebook: FaFacebookF,
  Twitter: FaTwitter,
};

const detailIconMap = {
  Email: Mail,
  Phone,
  Address: MapPin,
  'Working Hours': Clock3,
};

const inputClassName =
  'w-full rounded-[22px] border border-rose-200 bg-white px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-rose-100';

function ContactIllustration() {
  return (
    <div className="rounded-[36px] border border-white/75 bg-white/85 p-8 shadow-soft">
      <div className="rounded-[30px] bg-gradient-to-br from-primary to-secondary p-6 text-white">
        <Send size={28} />
        <p className="mt-5 font-display text-3xl font-semibold">We're here to help</p>
        <p className="mt-3 text-sm text-rose-50/85">Use the form for support, volunteer coordination, or partnership questions.</p>
      </div>
      <div className="mt-5 rounded-[28px] bg-rose-50 p-5 text-sm text-slate-600">
        BloodBridge keeps communication simple so healthcare outreach feels responsive and respectful.
      </div>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setModalOpen(true);
    setForm(initialForm);
  };

  return (
    <PageTransition className="bg-surface">
      <PageHeader
        badge="Contact"
        title="Reach the BloodBridge team."
        description="This contact page blends structured outreach with clear support information for users, volunteers, and healthcare partners."
        illustration={<ContactIllustration />}
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <AnimatedCard hover={false} className="p-7 sm:p-8">
            <SectionTitle
              badge="Send a Message"
              title="Contact Form"
              description="The layout is ready for a reliable communication flow."
            />
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <input className={inputClassName} placeholder="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
              <input className={inputClassName} type="email" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
              <input className={inputClassName} placeholder="Subject" value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} required />
              <textarea className={`${inputClassName} min-h-36 resize-none`} placeholder="Message" value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} required />
              <PrimaryButton type="submit" className="w-full">Send</PrimaryButton>
            </form>
          </AnimatedCard>

          <div className="space-y-6">
            <AnimatedCard delay={0.08} className="p-7">
              <h3 className="font-display text-2xl font-semibold text-text">Contact Information</h3>
              <div className="mt-5 space-y-4">
                {contactDetails.map((item) => {
                  const Icon = detailIconMap[item.label];

                  return (
                    <div key={item.label} className="flex items-start gap-3 rounded-[22px] bg-rose-50 px-4 py-4">
                      <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-soft">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">{item.label}</p>
                        <p className="mt-1 text-sm leading-7 text-slate-600">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.12} className="p-7">
              <h3 className="font-display text-2xl font-semibold text-text">Google Map Placeholder</h3>
              <div className="mt-5 flex min-h-56 items-center justify-center rounded-[28px] border border-dashed border-rose-200 bg-gradient-to-br from-rose-50 to-white text-center text-sm text-slate-500">
                Interactive map will be connected here later.
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.16} className="p-7">
              <h3 className="font-display text-2xl font-semibold text-text">Social Icons</h3>
              <div className="mt-5 flex flex-wrap gap-3">
                {socialLinks.map((item) => {
                  const Icon = socialIconMap[item.label];

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-rose-200 bg-white text-primary shadow-soft transition hover:-translate-y-1 hover:bg-rose-50"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      <SuccessModal
        open={modalOpen}
        title="Message Sent"
        description="Your message was submitted in this frontend preview and is ready to be wired to a real contact endpoint later."
        onClose={() => setModalOpen(false)}
      />
    </PageTransition>
  );
}

export default Contact;
