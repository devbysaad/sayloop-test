import axiosInstance from '../../lib/axiosInstance';
import type { Match, MatchUser } from '../../lib/matchApi';

// Re-export types so consumers only import from the service
export type { Match, MatchUser };

const matchService = {
    async getBrowseUsers(): Promise<MatchUser[]> {
        const { data } = await axiosInstance.get('/api/users/browse');
        return data.data;
    },

    async requestMatch(userId: number, partnerId: number, topic: string) {
        const { data } = await axiosInstance.post('/api/matches/find', {
            userId,
            partnerId,
            topic,
        });
        return data.data; // { matchId, status, ... }
    },

    async acceptMatch(matchId: number) {
        const { data } = await axiosInstance.post(
            `/api/matches/${matchId}/accept`,
        );
        return data.data;
    },

    async rejectMatch(matchId: number) {
        const { data } = await axiosInstance.post(
            `/api/matches/${matchId}/reject`,
        );
        return data.data;
    },

    async getMatchById(matchId: number): Promise<Match> {
        const { data } = await axiosInstance.get(`/api/matches/${matchId}`);
        return data.data;
    },

    async getActiveMatches(userId: number): Promise<Match[]> {
        const { data } = await axiosInstance.get('/api/matches/active', {
            params: { userId },
        });
        return data.data;
    },

    async getMatchHistory(userId: number, page = 0) {
        const { data } = await axiosInstance.get('/api/matches/history', {
            params: { userId, page, limit: 15 },
        });
        return data.data;
    },
};

export default matchService;
