/**
 * Axios instance with automatic Clerk JWT injection.
 * All service files must use this instead of plain axios.
 *
 * Token strategy:
 *   1. If a React component has set a tokenGetter via setTokenGetter(),
 *      use that (guaranteed fresh, works on first load / OAuth redirect).
 *   2. Fallback: try window.Clerk.session.getToken() for non-React callers.
 */
import axios from 'axios';

// ── Token getter (set from React via useAuthInit) ────────────────────────────
let tokenGetter: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: () => Promise<string | null>) => {
  tokenGetter = fn;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  try {
    let token: string | null = null;

    // Preferred: React-provided getter (useAuth().getToken)
    if (tokenGetter) {
      token = await tokenGetter();
    }

    // Fallback: window.Clerk (may not be ready on first render)
    if (!token) {
      const clerk = (window as any).Clerk;
      if (clerk?.session) {
        token = await clerk.session.getToken();
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[axiosInstance] Token attached (length: ${token.length}, preview: ${token.substring(0, 20)}...)`);
    } else {
      console.warn('[axiosInstance] No token available — request will be sent without Authorization header');
    }
  } catch (err) {
    // Token not available — request proceeds without auth
    console.warn('[axiosInstance] Could not get Clerk token:', err);
  }
  return config;
});

// Global response error handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401) {
      console.error('[axiosInstance] 401 Unauthorized:', message);
    } else if (status === 403) {
      console.error('[axiosInstance] 403 Forbidden:', message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;