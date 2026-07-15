import { getStorageItem, removeStorageItem, setStorageItem } from '../helpers/storage';

export const AUTH_TOKEN_KEY = 'bloodbridge-auth-token';
export const AUTH_USER_KEY = 'bloodbridge-auth-user';

export function getAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getStoredAuthUser() {
  return getStorageItem(AUTH_USER_KEY);
}

export function saveAuthSession(token, user) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  setStorageItem(AUTH_USER_KEY, user);
}

export function saveAuthUser(user) {
  setStorageItem(AUTH_USER_KEY, user);
}

export function clearAuthSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  removeStorageItem(AUTH_USER_KEY);
}
