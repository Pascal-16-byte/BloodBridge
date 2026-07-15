import { useMemo, useState } from 'react';
import { FiCalendar, FiHeart, FiLock, FiMail, FiMapPin, FiPhone, FiShield, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthSection from '../components/auth/AuthSection';
import ProfileUpload from '../components/auth/ProfileUpload';
import InputField from '../components/ui/InputField';
import LoadingButton from '../components/ui/LoadingButton';
import PasswordField from '../components/ui/PasswordField';
import SelectField from '../components/ui/SelectField';
import SuccessMessage from '../components/ui/SuccessMessage';
import { bloodGroups } from '../constants/bloodGroups';
import { useAuth } from '../hooks/useAuth';
import { authSelectOptions, getPasswordStrength, validateRegister } from '../utils/authValidation';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  bloodGroup: '',
  gender: '',
  dateOfBirth: '',
  city: '',
  state: '',
  role: '',
  password: '',
  confirmPassword: '',
  avatar: '',
  termsAccepted: false,
};

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const passwordStrength = useMemo(() => getPasswordStrength(values.password), [values.password]);

  const updateField = (name, value) => {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);

    if (touched[name]) {
      setErrors(validateRegister(nextValues));
    }
  };

  const handleBlur = (name) => {
    const nextTouched = { ...touched, [name]: true };
    setTouched(nextTouched);
    setErrors(validateRegister(values));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    updateField('avatar', objectUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegister(values);
    setTouched(
      Object.keys(initialValues).reduce((accumulator, key) => ({ ...accumulator, [key]: true }), {}),
    );
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      showErrorToast(Object.values(nextErrors)[0]);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(values);
      const successText = 'Registration successful. Please sign in to continue.';
      setSuccessMessage(successText);
      showSuccessToast(successText);
      navigate('/login', { replace: true });
    } catch (error) {
      setErrors({
        fullName: error.fieldErrors?.fullName,
        email: error.fieldErrors?.email || error.message,
        phone: error.fieldErrors?.phoneNumber,
        bloodGroup: error.fieldErrors?.bloodGroup,
        gender: error.fieldErrors?.gender,
        dateOfBirth: error.fieldErrors?.dateOfBirth,
        city: error.fieldErrors?.city,
        state: error.fieldErrors?.state,
        password: error.fieldErrors?.password,
      });
      showErrorToast(error.message || 'Unable to create your account right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Create Account"
      title="Join the BloodBridge community"
      description="Set up your donor profile with a polished, reassuring experience connected to secure backend authentication."
      sideTitle="A thoughtful first step into life-saving community care"
      sideDescription="Your registration flow is built to feel clear, calm, and trustworthy so future donors and families can move forward with confidence."
      highlights={['Live validation on every key field', 'Profile image preview before upload', 'Prepared for donor profile details', 'Strong password guidance built in']}
    >
      <SuccessMessage message={successMessage} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthSection
          title="Personal Information"
          description="Basic identity and contact details for your BloodBridge account."
          icon={FiUser}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Full Name"
              name="fullName"
              value={values.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              onBlur={() => handleBlur('fullName')}
              error={touched.fullName ? errors.fullName : ''}
              icon={FiUser}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={(event) => updateField('email', event.target.value)}
              onBlur={() => handleBlur('email')}
              error={touched.email ? errors.email : ''}
              icon={FiMail}
            />
            <InputField
              label="Phone Number"
              name="phone"
              inputMode="numeric"
              value={values.phone}
              onChange={(event) => updateField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
              onBlur={() => handleBlur('phone')}
              error={touched.phone ? errors.phone : ''}
              icon={FiPhone}
            />
            <InputField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={values.dateOfBirth}
              onChange={(event) => updateField('dateOfBirth', event.target.value)}
              onBlur={() => handleBlur('dateOfBirth')}
              error={touched.dateOfBirth ? errors.dateOfBirth : ''}
              icon={FiCalendar}
            />
          </div>
        </AuthSection>

        <AuthSection
          title="Donation Information"
          description="Details that support future donor matching and role-aware experiences."
          icon={FiHeart}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Blood Group"
              name="bloodGroup"
              value={values.bloodGroup}
              onChange={(event) => updateField('bloodGroup', event.target.value)}
              onBlur={() => handleBlur('bloodGroup')}
              error={touched.bloodGroup ? errors.bloodGroup : ''}
              options={bloodGroups}
            />
            <SelectField
              label="Gender"
              name="gender"
              value={values.gender}
              onChange={(event) => updateField('gender', event.target.value)}
              onBlur={() => handleBlur('gender')}
              error={touched.gender ? errors.gender : ''}
              options={authSelectOptions.genders}
            />
            <InputField
              label="City"
              name="city"
              value={values.city}
              onChange={(event) => updateField('city', event.target.value)}
              onBlur={() => handleBlur('city')}
              error={touched.city ? errors.city : ''}
              icon={FiMapPin}
            />
            <InputField
              label="State"
              name="state"
              value={values.state}
              onChange={(event) => updateField('state', event.target.value)}
              onBlur={() => handleBlur('state')}
              error={touched.state ? errors.state : ''}
              icon={FiMapPin}
            />
            <div className="md:col-span-2">
              <SelectField
                label="User Type"
                name="role"
                value={values.role}
                onChange={(event) => updateField('role', event.target.value)}
                onBlur={() => handleBlur('role')}
                error={touched.role ? errors.role : ''}
                options={authSelectOptions.roles}
              />
            </div>
          </div>
        </AuthSection>

        <AuthSection
          title="Security"
          description="Choose a strong password for your BloodBridge account."
          icon={FiLock}
        >
          <div className="space-y-4">
            <PasswordField
              label="Password"
              name="password"
              value={values.password}
              onChange={(event) => updateField('password', event.target.value)}
              onBlur={() => handleBlur('password')}
              error={touched.password ? errors.password : ''}
              strength={passwordStrength}
            />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={(event) => updateField('confirmPassword', event.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              error={touched.confirmPassword ? errors.confirmPassword : ''}
            />
          </div>
        </AuthSection>

        <AuthSection
          title="Profile Image"
          description="Upload a profile image for immediate preview."
          icon={FiUser}
        >
          <ProfileUpload preview={avatarPreview} onChange={handleAvatarChange} />
        </AuthSection>

        <AuthSection
          title="Terms"
          description="Review the account terms before creating your profile."
          icon={FiShield}
        >
          <div className={touched.termsAccepted && errors.termsAccepted ? 'animate-shake' : ''}>
            <label className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-white/70 p-4 text-sm leading-6 text-slate-600">
              <input
                type="checkbox"
                checked={values.termsAccepted}
                onChange={(event) => updateField('termsAccepted', event.target.checked)}
                onBlur={() => handleBlur('termsAccepted')}
                className="mt-1 h-4 w-4 rounded border-rose-200 text-primary focus:ring-4 focus:ring-primary/20"
              />
              <span>I agree to the Terms and understand my registration details will be submitted to BloodBridge.</span>
            </label>
            {touched.termsAccepted && errors.termsAccepted ? (
              <p className="mt-2 text-sm text-primary">{errors.termsAccepted}</p>
            ) : null}
          </div>
        </AuthSection>

        <LoadingButton isLoading={isSubmitting} loadingText="Creating account..." type="submit" className="w-full">
          Create Account
        </LoadingButton>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary transition hover:text-secondary">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
