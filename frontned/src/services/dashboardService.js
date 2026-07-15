import axiosInstance from '../config/axios';
import { getApiErrorMessage } from './authService';

function unwrapApiResponse(response) {
  return response.data?.data ?? response.data;
}

function createApiError(error, fallback) {
  const apiError = new Error(getApiErrorMessage(error, fallback));
  apiError.status = error.response?.status;
  return apiError;
}

/**
 * @returns {Promise<{
 *   userName: string,
 *   bloodGroup: string,
 *   profileCompletion: number,
 *   donationEligibility: boolean,
 *   lastDonationDate: string | null,
 *   emergencyAvailability: boolean,
 *   totalDonations: number,
 *   activeRequestsCount: number,
 *   pendingRequestsCount: number
 * }>}
 */
export async function getDashboardSummary() {
  try {
    const response = await axiosInstance.get('/dashboard');
    return unwrapApiResponse(response);
  } catch (error) {
    throw createApiError(error, 'Unable to load dashboard.');
  }
}
