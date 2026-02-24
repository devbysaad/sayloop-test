/**
 * src/lib/axiosInstance.ts
 *
 * BUG FIXED: All services were doing localStorage.getItem('clerk_token').
 * Clerk does NOT store tokens under that key — it manages them internally.
 * The correct approach: call clerk.session.getToken() via the global Clerk object.
 *
 * Use this instance in ALL service files instead of plain axios.
 */
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
});

axiosInstance.interceptors.request.use(async (config) => {
    try {
        // Clerk exposes itself on window after initialisation
        const clerk = (window as any).Clerk;
        if (clerk?.session) {
            const token = await clerk.session.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            if (clerk.user?.id) {
                config.headers['x-clerk-id'] = clerk.user.id;
            }
        }
    } catch {
        // If Clerk isn't ready yet, send request without auth (will 401 and surface properly)
    }
    return config;
});

export default axiosInstance;