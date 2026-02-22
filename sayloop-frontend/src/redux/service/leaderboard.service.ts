import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sayloop_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─────────────────────────────────────────────────────────────────────────────
// Leaderboard API
// ─────────────────────────────────────────────────────────────────────────────

export const leaderboardApi = {
  getPaginated: async (page: number, limit: number) => {
    const res = await api.get(`/leaderboard/paginated?page=${page}&limit=${limit}`);
    return res.data.data;
  },
  getTop: async () => {
    const res = await api.get('/leaderboard/top');
    return res.data.data;
  },
  getUserRank: async (userId: number) => {
    const res = await api.get(`/leaderboard/rank/${userId}`);
    return res.data.data;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Profile API
// ─────────────────────────────────────────────────────────────────────────────

export const profileApi = {
  getPublicProfile: async (userId: number) => {
    const res = await api.get(`/profiles/${userId}`);
    return res.data.data;
  },
  getStats: async (userId: number) => {
    const res = await api.get(`/profiles/${userId}/stats`);
    return res.data.data;
  },
  search: async (query: string) => {
    const res = await api.get(`/profiles/search?q=${encodeURIComponent(query)}`);
    return res.data.data;
  },
};