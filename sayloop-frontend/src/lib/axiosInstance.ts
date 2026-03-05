import axios from 'axios';

let tokenGetter: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: () => Promise<string | null>) => {
  if (tokenGetter) {
    console.warn('[axiosInstance] tokenGetter is being overwritten — ensure setTokenGetter is only called once');
  }
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

    if (tokenGetter) {
      token = await tokenGetter();
    }

    if (!token) {
      try {
        const clerk = (window as any).Clerk;
        if (clerk?.session) {
          token = await clerk.session.getToken();
        }
      } catch {
        console.warn('[axiosInstance] window.Clerk fallback failed');
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (import.meta.env.DEV) {
        console.log(`[axiosInstance] Token attached (length: ${token.length})`);
      }
    } else {
      console.warn('[axiosInstance] No token available — request will be sent without Authorization header');
    }
  } catch (err) {
    console.warn('[axiosInstance] Could not get Clerk token:', err);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401 && !error.config._retried) {
      error.config._retried = true;
      try {
        const token = await tokenGetter?.();
        if (token) {
          error.config.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(error.config);
        }
      } catch {
        console.warn('[axiosInstance] Token refresh on 401 retry failed');
      }
      console.error('[axiosInstance] 401 Unauthorized:', message);
    }

    if (status === 403) {
      console.error('[axiosInstance] 403 Forbidden:', message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;