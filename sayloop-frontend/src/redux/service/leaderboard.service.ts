/**
 * BUG FIXED: was using localStorage.getItem('clerk_token') — wrong Clerk token access.
 * Now uses axiosInstance which injects the correct Bearer token automatically.
 */
import axiosInstance from '../../lib/axiosInstance';

const leaderboardService = {
  async fetchLeaderboard(page: number, limit: number) {
    const { data } = await axiosInstance.get('/api/leaderboard/paginated', {
      params: { page, limit },
    });
    return data; // { success, data: { data[], total, page, limit, totalPages } }
  },

  async fetchUserRank(userId: number) {
    const { data } = await axiosInstance.get(`/api/leaderboard/rank/${userId}`);
    return data; // { success, data: { userId, rank, points, streakLength } }
  },
};

export default leaderboardService;