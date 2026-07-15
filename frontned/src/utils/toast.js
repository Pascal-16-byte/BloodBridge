import toast from 'react-hot-toast';

export const showSuccessToast = (message) => toast.success(message);
export const showErrorToast = (message) => toast.error(message);

export function showNetworkToast() {
  toast.error('Network error. Please try again in a moment.');
}
