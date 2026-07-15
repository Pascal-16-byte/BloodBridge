import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import PrimaryButton from '../components/buttons/PrimaryButton';
import InputField from '../components/ui/InputField';
import LoadingButton from '../components/ui/LoadingButton';
import SuccessMessage from '../components/ui/SuccessMessage';
import { authTypography } from '../components/ui/authStyles';
import { validateForgotPassword } from '../utils/authValidation';
import { showErrorToast, showSuccessToast } from '../utils/toast';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForgotPassword({ email });
    setTouched(true);
    setError(nextErrors.email || '');

    if (nextErrors.email) {
      showErrorToast(nextErrors.email);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1050));
    setIsSubmitting(false);
    setIsSent(true);
    showSuccessToast('Reset link sent successfully.');
  };

  return (
    <AuthLayout
      badge="Password Reset"
      title="Forgot your password?"
      description="Enter your email and we will help you start the reset process when account recovery is enabled."
      sideTitle="Recovery should feel simple and reassuring"
      sideDescription="This page keeps the experience light, clear, and responsive while still matching the premium BloodBridge visual language."
      compact
    >
      {isSent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center"
        >
          <div className="mx-auto flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <FiCheckCircle size={38} />
          </div>
          <h3 className="mt-6 font-display text-2xl font-semibold text-text">Reset link on its way</h3>
          <p className={`mt-4 ${authTypography.body}`}>
            A reset request has been prepared for <span className="font-semibold text-text">{email}</span>.
          </p>
          <SuccessMessage message="In production, this is where email delivery confirmation would appear." />
          <div className="mt-8 flex justify-center">
            <PrimaryButton as={Link} to="/login">
              <FiArrowLeft />
              Back to Login
            </PrimaryButton>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (touched) {
                setError(validateForgotPassword({ email: event.target.value }).email || '');
              }
            }}
            onBlur={() => {
              setTouched(true);
              setError(validateForgotPassword({ email }).email || '');
            }}
            error={touched ? error : ''}
            icon={FiMail}
          />

          <LoadingButton isLoading={isSubmitting} loadingText="Sending link..." type="submit" className="w-full">
            Send Reset Link
          </LoadingButton>

          <p className="text-center text-sm text-slate-500">
            Remembered it?{' '}
            <Link to="/login" className="font-semibold text-primary transition hover:text-secondary">
              Back to Login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
