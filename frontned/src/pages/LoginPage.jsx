import { useMemo, useState } from 'react';
import { FiArrowRight, FiHeart, FiMail, FiShield } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import SecondaryButton from '../components/buttons/SecondaryButton';
import InputField from '../components/ui/InputField';
import LoadingButton from '../components/ui/LoadingButton';
import PasswordField from '../components/ui/PasswordField';
import SuccessMessage from '../components/ui/SuccessMessage';
import { authTypography } from '../components/ui/authStyles';
import { useAuth } from '../hooks/useAuth';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import { validateLogin } from '../utils/authValidation';

const initialValues = {
  email: '',
  password: '',
  rememberMe: false,
};

function LoginPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/dashboard';
  const successHint = useMemo(
    () => (currentUser ? 'You are already signed in. Logging in again will refresh your dashboard profile.' : ''),
    [currentUser],
  );

  const updateField = (name, value) => {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);

    if (touched[name]) {
      setErrors(validateLogin(nextValues));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setTouched({ email: true, password: true });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      showErrorToast(nextErrors.email || nextErrors.password || 'Please fix the highlighted fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(values);
      showSuccessToast('Login successful.');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrors({ email: error.fieldErrors?.email, password: error.fieldErrors?.password || error.message });
      showErrorToast(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Sign In"
      title="Welcome Back"
      description="Continue with your BloodBridge account to respond faster, manage requests, and keep your community close when urgency rises."
      sideTitle="Support should feel calm, even when time is short."
      sideDescription="Your dashboard is designed to keep blood requests, donor readiness, and emergency coordination clear and deeply human."
      highlights={['Verified donor-first experience', 'Secure backend authentication', 'Responsive glassmorphism design system', 'JWT protected dashboard access']}
      sideContent={
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <FiHeart size={24} />
          </div>
          <p className="text-lg font-medium">Secure account access</p>
          <p className="mt-3 text-sm leading-7 text-rose-50/78">
            Sign in with your registered BloodBridge account to access your protected donor dashboard.
          </p>
        </div>
      }
    >
      <SuccessMessage message={successHint} />

      <div className="mb-6 rounded-2xl border border-rose-100 bg-white/70 p-4">
        <div className="flex items-start gap-3">
          <FiShield className="mt-0.5 text-primary" size={18} />
          <p className={authTypography.helper}>
            Your email and password are verified by the BloodBridge backend before dashboard access is granted.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            onBlur={() => {
              const nextTouched = { ...touched, email: true };
              setTouched(nextTouched);
              setErrors(validateLogin(values));
            }}
            error={touched.email ? errors.email : ''}
            icon={FiMail}
          />

          <PasswordField
            label="Password"
            name="password"
            value={values.password}
            onChange={(event) => updateField('password', event.target.value)}
            onBlur={() => {
              const nextTouched = { ...touched, password: true };
              setTouched(nextTouched);
              setErrors(validateLogin(values));
            }}
            error={touched.password ? errors.password : ''}
          />
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white/60 p-4">
          <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-3">
              <input
                type="checkbox"
                checked={values.rememberMe}
                onChange={(event) => updateField('rememberMe', event.target.checked)}
                className="h-4 w-4 rounded border-rose-200 text-primary focus:ring-primary"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-medium text-primary transition hover:text-secondary">
              Forgot Password?
            </Link>
          </div>
        </div>

        <LoadingButton isLoading={isSubmitting} loadingText="Signing in..." type="submit" className="w-full">
          <span className="inline-flex items-center gap-2">
            Login
            <FiArrowRight />
          </span>
        </LoadingButton>

        <div className="flex items-center gap-4 py-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <span className="h-px flex-1 bg-rose-100" />
          Or continue with
          <span className="h-px flex-1 bg-rose-100" />
        </div>

        <SecondaryButton
          type="button"
          className="w-full gap-3"
          onClick={() => showSuccessToast('Google sign-in is not enabled for this backend yet.')}
        >
          <FcGoogle size={20} />
          Continue with Google
        </SecondaryButton>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        New here?{' '}
        <Link to="/register" className="font-semibold text-primary transition hover:text-secondary">
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
