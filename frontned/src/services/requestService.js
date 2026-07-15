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
    patientName: payload.patientName.trim(),
    bloodGroup: bloodGroupMap[payload.bloodGroup] || payload.bloodGroup,
    unitsRequired: Number(payload.unitsRequired),
    hospitalName: payload.hospitalName.trim(),
    hospitalAddress: payload.hospitalAddress.trim(),
    city: payload.city.trim(),
    district: payload.district.trim(),
    state: payload.state.trim(),
    contactPerson: payload.contactPerson.trim(),
    contactNumber: payload.contactNumber.trim(),
    urgency: payload.urgency,
    requiredBefore: payload.requiredBefore,
    notes: payload.notes?.trim() || null,
    status: payload.status || undefined,
  };
}

export async function createBloodRequest(payload) {
  try {
    const response = await axiosInstance.post('/requests', normalizePayload(payload));
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(error, 'Unable to create blood request.');
  }
}

export async function getBloodRequests() {
  try {
    const response = await axiosInstance.get('/requests');
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(error, 'Unable to load blood requests.');
  }
}

export async function getActiveRequestFeed({ sort = 'latest', city = '' } = {}) {
  try {
    const response = await axiosInstance.get('/requests/feed', {
      params: {
        sort,
        city: city.trim() || undefined,
      },
    });
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(error, 'Unable to load active request feed.');
  }
}

export async function getBloodRequest(id) {
  try {
    const response = await axiosInstance.get(`/requests/${id}`);
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(error, 'Unable to load blood request.');
  }
}

export async function updateBloodRequest(id, payload) {
  try {
    const response = await axiosInstance.put(`/requests/${id}`, normalizePayload(payload));
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(error, 'Unable to update blood request.');
  }
}

export async function deleteBloodRequest(id) {
  try {
    const response = await axiosInstance.delete(`/requests/${id}`);
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(error, 'Unable to delete blood request.');
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

export function formatDateTime(value) {
  if (!value) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatPostedTime(value) {
  if (!value) {
    return 'Recently posted';
  }

  const postedAt = new Date(value).getTime();
  const diffMs = Date.now() - postedAt;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

export function toDateTimeLocal(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}
