import axiosInstance from '../config/axios';
import { getApiErrorMessage } from './authService';

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

function createApiError(error, fallback) {
  const apiError = new Error(getApiErrorMessage(error, fallback));
  const fieldErrors = error.response?.data?.errors;
  apiError.status = error.response?.status;
  apiError.fieldErrors = fieldErrors && typeof fieldErrors === 'object' ? fieldErrors : {};
  return apiError;
}

function normalizePayload(payload) {
  return {
    bloodGroup: bloodGroupMap[payload.bloodGroup] || payload.bloodGroup,
    age: Number(payload.age),
    gender: genderMap[payload.gender] || payload.gender,
    weight: Number(payload.weight),
    lastDonationDate: payload.lastDonationDate || null,
    medicalConditions: payload.medicalConditions?.trim() || null,
    emergencyAvailable: Boolean(payload.emergencyAvailable),
    preferredDonationDistance: Number(payload.preferredDonationDistance),
    city: payload.city.trim(),
    district: payload.district.trim(),
    state: payload.state.trim(),
    pincode: payload.pincode.trim(),
  };
}

export async function getDonorProfile() {
  try {
    const response = await axiosInstance.get('/profile');
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(error, 'Unable to load your donor profile.');
  }
}

export async function createDonorProfile(payload) {
  try {
    const response = await axiosInstance.post('/profile', normalizePayload(payload));
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(error, 'Unable to create your donor profile.');
  }
}

export async function updateDonorProfile(payload) {
  try {
    const response = await axiosInstance.put('/profile', normalizePayload(payload));
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(error, 'Unable to update your donor profile.');
  }
}

export function formatBloodGroup(value) {
  const labels = {
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
  };

  return labels[value] || value || '';
}

export function formatGender(value) {
  if (!value) {
    return '';
  }

  return value.charAt(0) + value.slice(1).toLowerCase();
}
