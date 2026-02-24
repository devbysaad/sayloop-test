/**
 * BUG FIXED: was using localStorage.getItem('clerk_token') — wrong Clerk token access.
 */
import axiosInstance from '../../lib/axiosInstance';

const profileService = {
  async fetchProfileStats(userId: number) {
    const { data } = await axiosInstance.get(`/api/profiles/${userId}/stats`);
    return data; // { success, data: ProfileStats }
  },

  async getPublicProfile(userId: number) {
    const { data } = await axiosInstance.get(`/api/profiles/${userId}`);
    return data;
  },
};

export default profileService;