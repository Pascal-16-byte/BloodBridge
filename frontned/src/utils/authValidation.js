import { validateEmail, validatePhone } from '../helpers/validation';

export const authSelectOptions = {
  roles: ['User', 'Donor'],
  genders: ['Male', 'Female', 'Other'],
};

export function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-300' };
  if (score === 3 || score === 4) return { score, label: 'Good', color: 'bg-amber-400' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

export function validateLogin(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
}

export function validateForgotPassword(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}

export function validateRegister(values) {
  const errors = {};

  if (!values.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!validateEmail(values.email)) errors.email = 'Enter a valid email address.';

  if (!values.phone.trim()) errors.phone = 'Phone number is required.';
  else if (!validatePhone(values.phone)) errors.phone = 'Phone number must be 10 digits.';

  if (!values.bloodGroup) errors.bloodGroup = 'Please select a blood group.';
  if (!values.gender) errors.gender = 'Please select a gender.';
  if (!values.dateOfBirth) errors.dateOfBirth = 'Date of birth is required.';
  if (!values.city.trim()) errors.city = 'City is required.';
  if (!values.state.trim()) errors.state = 'State is required.';
  if (!values.role) errors.role = 'Please choose a role.';

  if (!values.password) errors.password = 'Password is required.';
  else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters.';

  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.';

  if (!values.termsAccepted) errors.termsAccepted = 'You must agree to the Terms.';

  return errors;
}
