import axiosInstance from '../../lib/axiosInstance';
import type { ProfileStats } from '../slice/profile.slice';

const profileService = {
  async fetchProfileStats(userId: number): Promise<ProfileStats> {
    const { data } = await axiosInstance.get(`/api/profiles/${userId}/stats`);
    // Backend returns { success: true, data: ProfileStats, message: '...' }
    // We unwrap here so the saga receives ProfileStats directly
    return data.data;
  },

  async getPublicProfile(userId: number) {
    const { data } = await axiosInstance.get(`/api/profiles/${userId}`);
    return data.data;
  },
};

export default profileService;