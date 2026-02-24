/**
 * BUG FIXED: was using localStorage.getItem('clerk_token') — wrong Clerk token access.
 * BUG FIXED: searchPartners no longer needs to send userId — backend uses req.dbUserId.
 */
import axiosInstance from '../../lib/axiosInstance';

export interface FetchPartnersParams {
  topic: string;
  page?: number;
  limit?: number;
}

export interface RequestMatchParams {
  userId: number;
  partnerId: number;
  topic: string;
}

const partnersService = {
  async fetchPartners({ topic, page = 0, limit = 10 }: FetchPartnersParams) {
    const { data } = await axiosInstance.get('/api/profiles/search', {
      params: { topic, page, limit },
      // BUG FIXED: removed userId param — backend derives it from auth token
    });
    return data; // { success, data: { partners[], hasMore, page, total } }
  },

  async requestMatch({ userId, partnerId, topic }: RequestMatchParams) {
    const { data } = await axiosInstance.post('/api/matches/find', {
      userId, partnerId, topic,
    });
    return data; // { success, data: { matchId, status, partnerId, topic } }
  },

  async acceptMatch(matchId: number) {
    const { data } = await axiosInstance.post(`/api/matches/${matchId}/accept`, {});
    return data;
  },

  async rejectMatch(matchId: number) {
    const { data } = await axiosInstance.post(`/api/matches/${matchId}/reject`, {});
    return data;
  },
};

export default partnersService;