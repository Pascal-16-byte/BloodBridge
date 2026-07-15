import axiosInstance from '../config/axios';

const bloodGroupMap = {
  'A+': 'A_POSITIVE',
  'A-': 'A_NEGATIVE',
  'B+': 'B_POSITIVE',
  'B-': 'B_NEGATIVE',
  'AB+': 'AB_POSITIVE',
  'AB-': 'AB_NEGATIVE',
  'O+': 'O_POSITIVE',
  'O-': 'O_NEGATIVE',
};

const genderMap = {
  Male: 'MALE',
  Female: 'FEMALE',
  Other: 'OTHER',
};

function unwrapApiResponse(response) {
  return response.data?.data ?? response.data;
}

function createApiError(message, fieldErrors = {}) {
  const apiError = new Error(message);
  apiError.fieldErrors = fieldErrors;
  return apiError;
}

function getApiFieldErrors(error) {
  const fieldErrors = error.response?.data?.errors;
  return fieldErrors && typeof fieldErrors === 'object' ? fieldErrors : {};
}

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error.response) {
    return 'Backend is unavailable. Please check your connection and try again.';
  }

  const responseBody = error.response.data;
  const fieldErrors = responseBody?.errors;

  if (fieldErrors && typeof fieldErrors === 'object') {
    return Object.values(fieldErrors).filter(Boolean).join(' ') || responseBody?.message || fallback;
  }

  if (error.response.status === 403) {
    return 'You do not have permission to access this resource.';
  }

  if (error.response.status === 404) {
    return 'The requested resource was not found.';
  }

  if (error.response.status >= 500) {
    return 'The server had trouble processing the request. Please try again shortly.';
  }

  return responseBody?.message || fallback;
}

export async function loginUser({ email, password }) {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });

    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(
      getApiErrorMessage(error, 'Unable to sign in with those credentials.'),
      getApiFieldErrors(error),
    );
  }
}

export async function registerUser(payload) {
  const requestBody = {
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    phoneNumber: payload.phone.trim(),
    bloodGroup: bloodGroupMap[payload.bloodGroup] || payload.bloodGroup,
    gender: genderMap[payload.gender] || payload.gender,
    dateOfBirth: payload.dateOfBirth,
    city: payload.city.trim(),
    state: payload.state.trim(),
    address: `${payload.city.trim()}, ${payload.state.trim()}`,
    available: true,
  };

  try {
    const response = await axiosInstance.post('/auth/register', requestBody);
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(
      getApiErrorMessage(error, 'Unable to create your account right now.'),
      getApiFieldErrors(error),
    );
  }
}

export async function getCurrentUserProfile() {
  try {
    const response = await axiosInstance.get('/donor/profile');
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(
      getApiErrorMessage(error, 'Unable to load your profile.'),
      getApiFieldErrors(error),
    );
  }
}

export async function requestPasswordReset() {
  throw new Error('Password reset is not available yet.');
}
