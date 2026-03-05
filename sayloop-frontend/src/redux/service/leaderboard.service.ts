import axiosInstance from '../../lib/axiosInstance';

const leaderboardService = {
  async fetchLeaderboard(page: number, limit: number) {
    const { data } = await axiosInstance.get('/api/leaderboard/paginated', {
      params: { page, limit },
    });
    // backend: { success, data: { data: [], total, page, limit, totalPages } }
    // data     = { success, data: PaginatedLeaderboard }
    // data.data = PaginatedLeaderboard 
    return data.data;
  },

  async fetchUserRank(userId: number) {
    const { data } = await axiosInstance.get(`/api/leaderboard/rank/${userId}`);
    // backend: { success, data: { userId, rank, points, streakLength } }
    return data.data;
  },
};

export default leaderboardService;