import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, HeartPulse, MapPin, Save } from 'lucide-react';
import PrimaryButton from '../components/buttons/PrimaryButton';
import AnimatedCard from '../components/common/AnimatedCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionTitle from '../components/common/SectionTitle';
import InputField from '../components/ui/InputField';
import LoadingButton from '../components/ui/LoadingButton';
import PageTransition from '../components/PageTransition';
import { bloodGroups } from '../constants/bloodGroups';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { createDonorProfile, formatBloodGroup, formatGender, getDonorProfile, updateDonorProfile } from '../services/profileService';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const initialForm = {
  bloodGroup: '',
  age: '',
  gender: '',
  weight: '',
  lastDonationDate: '',
  medicalConditions: '',
  emergencyAvailable: false,
  preferredDonationDistance: '25',
  city: '',
  district: '',
  state: '',
  pincode: '',
};

const genderOptions = ['Male', 'Female', 'Other'];

function toForm(profile, currentUser) {
  return {
    bloodGroup: formatBloodGroup(profile?.bloodGroup || currentUser?.bloodGroup || ''),
    age: profile?.age || '',
    gender: formatGender(profile?.gender || currentUser?.gender || ''),
    weight: profile?.weight || '',
    lastDonationDate: profile?.lastDonationDate || currentUser?.lastDonationDate || '',
    medicalConditions: profile?.medicalConditions || '',
    emergencyAvailable: Boolean(profile?.emergencyAvailable ?? currentUser?.available ?? false),
    preferredDonationDistance: profile?.preferredDonationDistance || '25',
    city: profile?.city || currentUser?.city || '',
    district: profile?.district || currentUser?.city || '',
    state: profile?.state || currentUser?.state || '',
    pincode: profile?.pincode || '',
  };
}

function validate(form) {
  const errors = {};

  if (!form.bloodGroup) errors.bloodGroup = 'Blood group is required';
  if (!form.gender) errors.gender = 'Gender is required';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.district.trim()) errors.district = 'District is required';
  if (!form.state.trim()) errors.state = 'State is required';
  if (!/^[0-9]{5,10}$/.test(form.pincode.trim())) errors.pincode = 'Pincode must contain 5 to 10 digits';

  const age = Number(form.age);
  if (!age || age < 18 || age > 65) errors.age = 'Age must be between 18 and 65';

  const weight = Number(form.weight);
  if (!weight || weight < 45) errors.weight = 'Weight must be at least 45 kg';

  const distance = Number(form.preferredDonationDistance);
  if (!distance || distance < 1 || distance > 250) errors.preferredDonationDistance = 'Distance must be between 1 and 250 km';

  if (form.lastDonationDate && new Date(form.lastDonationDate) > new Date()) {
    errors.lastDonationDate = 'Last donation date cannot be in the future';
  }

  if (form.medicalConditions.length > 500) {
    errors.medicalConditions = 'Medical conditions must not exceed 500 characters';
  }

  return errors;
}

function EditProfilePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  const title = useMemo(() => (profileExists ? 'Edit donor profile' : 'Complete donor profile'), [profileExists]);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const profile = await getDonorProfile();
        if (active) {
          setForm(toForm(profile, currentUser));
          setProfileExists(true);
        }
      } catch (apiError) {
        if (!active) {
          return;
        }

        if (apiError.status === 404) {
          setForm(toForm(null, currentUser));
          setProfileExists(false);
        } else {
          setLoadError(apiError.message);
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
  }, [currentUser]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showErrorToast('Please fix the highlighted profile fields.');
      return;
    }

    setSaving(true);
    try {
      if (profileExists) {
        await updateDonorProfile(form);
        showSuccessToast('Donor profile updated successfully.');
      } else {
        await createDonorProfile(form);
        showSuccessToast('Donor profile created successfully.');
      }
      navigate(ROUTES.profile);
    } catch (apiError) {
      setErrors(apiError.fieldErrors || {});
      showErrorToast(apiError.message);
    } finally {
      setSaving(false);
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

  if (loadError) {
    return (
      <PageTransition className="bg-surface pt-28">
        <section className="mx-auto max-w-3xl px-5 pb-16 sm:px-6 lg:px-8">
          <AnimatedCard hover={false} className="p-8 text-center">
            <h1 className="font-display text-3xl font-semibold text-text">Unable to load donor profile</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">{loadError}</p>
            <div className="mt-7 flex justify-center">
              <PrimaryButton as={Link} to={ROUTES.profile}>Back to Profile</PrimaryButton>
            </div>
          </AnimatedCard>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="bg-surface pt-28">
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to={ROUTES.profile} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <ArrowLeft size={17} /> Back to profile
            </Link>
            <h1 className="mt-3 font-display text-4xl font-semibold text-text">{title}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr]">
          <AnimatedCard hover={false} className="p-7">
            <SectionTitle badge="Medical" title="Medical Information" />
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <InputField as="select" label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={(event) => updateField('bloodGroup', event.target.value)} error={errors.bloodGroup} options={bloodGroups} />
              <InputField as="select" label="Gender" name="gender" value={form.gender} onChange={(event) => updateField('gender', event.target.value)} error={errors.gender} options={genderOptions} />
              <InputField label="Age" name="age" type="number" min="18" max="65" value={form.age} onChange={(event) => updateField('age', event.target.value)} error={errors.age} />
              <InputField label="Weight (kg)" name="weight" type="number" min="45" step="0.1" value={form.weight} onChange={(event) => updateField('weight', event.target.value)} error={errors.weight} />
              <InputField label="Last Donation Date" name="lastDonationDate" type="date" value={form.lastDonationDate} onChange={(event) => updateField('lastDonationDate', event.target.value)} error={errors.lastDonationDate} />
              <InputField label="Preferred Distance (km)" name="preferredDonationDistance" type="number" min="1" max="250" value={form.preferredDonationDistance} onChange={(event) => updateField('preferredDonationDistance', event.target.value)} error={errors.preferredDonationDistance} />
              <div className="md:col-span-2">
                <InputField as="textarea" label="Medical Conditions" name="medicalConditions" rows="4" value={form.medicalConditions} onChange={(event) => updateField('medicalConditions', event.target.value)} error={errors.medicalConditions} />
              </div>
            </div>
          </AnimatedCard>

          <div className="space-y-7">
            <AnimatedCard hover={false} className="p-7">
              <SectionTitle badge="Location" title="Location" />
              <div className="mt-7 grid gap-5">
                <InputField label="City" name="city" value={form.city} onChange={(event) => updateField('city', event.target.value)} error={errors.city} icon={MapPin} />
                <InputField label="District" name="district" value={form.district} onChange={(event) => updateField('district', event.target.value)} error={errors.district} />
                <InputField label="State" name="state" value={form.state} onChange={(event) => updateField('state', event.target.value)} error={errors.state} />
                <InputField label="Pincode" name="pincode" value={form.pincode} onChange={(event) => updateField('pincode', event.target.value)} error={errors.pincode} />
              </div>
            </AnimatedCard>

            <AnimatedCard hover={false} className="p-7">
              <SectionTitle badge="Availability" title="Emergency Availability" />
              <label className="mt-6 flex items-start gap-3 rounded-[22px] bg-rose-50/70 px-4 py-4 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.emergencyAvailable}
                  onChange={(event) => updateField('emergencyAvailable', event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-rose-300 text-primary focus:ring-primary"
                />
                <span className="leading-6">Available for urgent donation requests within my preferred distance.</span>
              </label>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <LoadingButton type="submit" isLoading={saving} loadingText="Saving..." className="w-full">
                  <Save size={18} /> Save Profile
                </LoadingButton>
                <PrimaryButton as={Link} to={ROUTES.profile} className="w-full bg-slate-700 hover:bg-slate-800">
                  Cancel
                </PrimaryButton>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6">
              <HeartPulse className="text-primary" size={24} />
              <p className="mt-4 text-sm leading-7 text-slate-600">Your donor profile is private to your authenticated account and can only be changed by you.</p>
            </AnimatedCard>
          </div>
        </form>
      </section>
    </PageTransition>
  );
}

export default EditProfilePage;
