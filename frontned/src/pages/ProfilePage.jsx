import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CalendarDays, CheckCircle2, Edit3, HeartPulse, MapPin, Route, ShieldCheck, UserRound } from 'lucide-react';
import PrimaryButton from '../components/buttons/PrimaryButton';
import AnimatedCard from '../components/common/AnimatedCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import PageHeader from '../components/common/PageHeader';
import SectionTitle from '../components/common/SectionTitle';
import PageTransition from '../components/PageTransition';
import { ROUTES } from '../constants/routes';
import { formatBloodGroup, formatGender, getDonorProfile } from '../services/profileService';

function CompletionRing({ value = 0 }) {
  return (
    <div className="rounded-[28px] border border-rose-100 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Profile completion</p>
          <p className="mt-2 font-display text-4xl font-semibold text-text">{value}%</p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-primary">
          <ShieldCheck size={28} />
        </div>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-rose-100">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-[22px] bg-rose-50/70 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">{label}</p>
      <p className="mt-2 text-sm font-medium text-text">{value || 'Not provided'}</p>
    </div>
  );
}

function ProfileIllustration({ profile }) {
  return (
    <div className="rounded-[32px] border border-white/75 bg-white/90 p-7 shadow-soft">
      <div className="flex items-center gap-4 rounded-[26px] bg-gradient-to-br from-primary to-secondary p-6 text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 font-display text-2xl font-semibold">
          {formatBloodGroup(profile?.bloodGroup)}
        </div>
        <div>
          <p className="text-sm text-rose-50/80">Donor profile</p>
          <p className="mt-1 font-display text-2xl font-semibold">{profile?.fullName || 'BloodBridge Donor'}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[22px] bg-rose-50 p-5">
          <MapPin className="text-primary" size={22} />
          <p className="mt-4 text-sm font-medium text-text">{profile?.city || 'Location pending'}</p>
        </div>
        <div className="rounded-[22px] bg-rose-50 p-5">
          <HeartPulse className="text-primary" size={22} />
          <p className="mt-4 text-sm font-medium text-text">{profile?.emergencyAvailable ? 'Emergency available' : 'Routine availability'}</p>
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await getDonorProfile();
        if (active) {
          setProfile(data);
        }
      } catch (apiError) {
        if (active) {
          setError(apiError.status === 404 ? 'Your donor profile is not set up yet.' : apiError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <PageTransition className="bg-surface pt-28">
        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
          <LoadingSkeleton className="h-72" />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <LoadingSkeleton className="h-60" />
            <LoadingSkeleton className="h-60" />
            <LoadingSkeleton className="h-60" />
          </div>
        </section>
      </PageTransition>
    );
  }

  if (error && !profile) {
    return (
      <PageTransition className="bg-surface pt-28">
        <section className="mx-auto max-w-3xl px-5 pb-16 sm:px-6 lg:px-8">
          <AnimatedCard hover={false} className="p-8 text-center">
            <AlertCircle className="mx-auto text-primary" size={36} />
            <h1 className="mt-5 font-display text-3xl font-semibold text-text">{error}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">Complete your donor details so BloodBridge can show your eligibility, location, and availability accurately.</p>
            <div className="mt-7 flex justify-center">
              <PrimaryButton as={Link} to={ROUTES.editProfile}>Complete Profile</PrimaryButton>
            </div>
          </AnimatedCard>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="bg-surface">
      <PageHeader
        badge="Donor Profile"
        title={`${profile.fullName}'s donor profile`}
        description="Your donor information, health readiness, location, and availability in one protected place."
        actions={<PrimaryButton as={Link} to={ROUTES.editProfile}><Edit3 size={18} /> Edit Profile</PrimaryButton>}
        illustration={<ProfileIllustration profile={profile} />}
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <CompletionRing value={profile.completionPercentage || 0} />
          <AnimatedCard hover={false} className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Detail label="Blood group" value={formatBloodGroup(profile.bloodGroup)} />
              <Detail label="Age" value={profile.age ? `${profile.age} years` : ''} />
              <Detail label="Weight" value={profile.weight ? `${profile.weight} kg` : ''} />
            </div>
          </AnimatedCard>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <AnimatedCard hover={false} className="p-7">
            <SectionTitle badge="Personal" title="Personal Information" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Detail label="Name" value={profile.fullName} />
              <Detail label="Email" value={profile.email} />
              <Detail label="Phone" value={profile.phoneNumber} />
              <Detail label="Gender" value={formatGender(profile.gender)} />
            </div>
          </AnimatedCard>

          <AnimatedCard hover={false} className="p-7">
            <SectionTitle badge="Medical" title="Medical Information" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Detail label="Last donation" value={profile.lastDonationDate || 'No recent donation recorded'} />
              <Detail label="Status" value={profile.profileCompleted ? 'Complete' : 'Needs review'} />
              <div className="sm:col-span-2">
                <Detail label="Medical conditions" value={profile.medicalConditions || 'None reported'} />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard hover={false} className="p-7">
            <SectionTitle badge="Location" title="Location" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Detail label="City" value={profile.city} />
              <Detail label="District" value={profile.district} />
              <Detail label="State" value={profile.state} />
              <Detail label="Pincode" value={profile.pincode} />
            </div>
          </AnimatedCard>

          <AnimatedCard hover={false} className="p-7">
            <SectionTitle badge="Availability" title="Availability" />
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 rounded-[22px] bg-rose-50/70 px-4 py-4 text-sm font-medium text-text">
                {profile.emergencyAvailable ? <CheckCircle2 className="text-primary" size={20} /> : <CalendarDays className="text-primary" size={20} />}
                {profile.emergencyAvailable ? 'Available for emergency donation requests' : 'Available for planned donation requests'}
              </div>
              <div className="flex items-center gap-3 rounded-[22px] bg-rose-50/70 px-4 py-4 text-sm font-medium text-text">
                <Route className="text-primary" size={20} />
                Preferred distance: {profile.preferredDonationDistance} km
              </div>
              <div className="flex items-center gap-3 rounded-[22px] bg-rose-50/70 px-4 py-4 text-sm font-medium text-text">
                <UserRound className="text-primary" size={20} />
                Only you can edit this profile
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>
    </PageTransition>
  );
}

export default ProfilePage;
