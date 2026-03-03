import axiosInstance from './axiosInstance';

export interface MatchUser {
  id: number;
  firstName: string;
  username: string;
  pfpSource: string | null;
  points: number;
  learningLanguage: string;
  interests: string[];
  streakLength: number;
}

export interface Match {
  id: number;
  requesterId: number;
  receiverId: number;
  topic: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'completed';
  sessionId: string | null;
  createdAt: string;
  requester: Pick<MatchUser, 'id' | 'username' | 'firstName' | 'pfpSource'>;
  receiver:  Pick<MatchUser, 'id' | 'username' | 'firstName' | 'pfpSource'>;
}

export const requestMatch = (userId: number, partnerId: number, topic: string) =>
  axiosInstance.post('/api/matches/find', { userId, partnerId, topic }).then(r => r.data.data);

export const acceptMatch = (matchId: number) =>
  axiosInstance.post(`/api/matches/${matchId}/accept`).then(r => r.data.data);

export const rejectMatch = (matchId: number) =>
  axiosInstance.post(`/api/matches/${matchId}/reject`).then(r => r.data.data);

export const getMatchById = (matchId: number): Promise<Match> =>
  axiosInstance.get(`/api/matches/${matchId}`).then(r => r.data.data);

export const getActiveMatches = (userId: number) =>
  axiosInstance.get<{ data: Match[] }>(`/api/matches/active?userId=${userId}`).then(r => r.data.data);

export const getMatchHistory = (userId: number, page = 0) =>
  axiosInstance.get(`/api/matches/history?userId=${userId}&page=${page}&limit=15`).then(r => r.data.data);

export const getBrowseUsers = (_userId: number): Promise<MatchUser[]> =>
  axiosInstance.get('/api/users/browse').then(r => r.data.data);