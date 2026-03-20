import React from 'react';
import UserAvatar from './UserAvatar';
import type { Match } from '../../../lib/matchApi';
import { HistoryRowSkeleton } from '../../ui/SkeletonCard';

interface Props {
  history: Match[];
  loading: boolean;
  myUserId: number;
}

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string; border: string }> = {
  completed: { label: 'Completed', bg: '#F0FAF4', color: '#3D7A5C', border: 'rgba(61,122,92,0.22)' },
  rejected: { label: 'Declined', bg: '#FFF4EF', color: '#E8480C', border: 'rgba(232,72,12,0.2)' },
  expired: { label: 'Expired', bg: 'rgba(20,20,20,0.05)', color: 'rgba(20,20,20,0.4)', border: 'rgba(20,20,20,0.1)' },
  accepted: { label: 'Active', bg: '#EFF6FF', color: '#2563eb', border: '#bfdbfe' },
  pending: { label: 'Pending', bg: '#FEF8EF', color: '#B45309', border: 'rgba(180,83,9,0.2)' },
};

const TOPIC_EMOJI: Record<string, string> = {
  daily_life: '☀️', travel: '✈️', food: '🍜', movies: '🎬', tech: '💻',
  sports: '⚽', books: '📚', science: '🔬', business: '💼', art: '🎨', gaming: '🎮', health: '🏃',
};

const MatchHistory: React.FC<Props> = ({ history, loading, myUserId }) => {
  if (loading) return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map(i => <HistoryRowSkeleton key={i} />)}
    </div>
  );

  if (history.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">📜</div>
      <p className="font-black text-[#141414] text-lg" style={{ letterSpacing: '-0.3px' }}>No history yet</p>
      <p className="text-sm font-normal mt-1" style={{ color: 'rgba(20,20,20,0.45)' }}>Your past debate requests will appear here.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {history.map(m => {
        const isRequester = m.requesterId === myUserId;
        const partner = isRequester ? m.receiver : m.requester;
        const style = STATUS_STYLE[m.status] ?? STATUS_STYLE.expired;

        return (
          <div key={m.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
            style={{ border: '1px solid rgba(20,20,20,0.08)' }}>
            <UserAvatar user={partner} size={44} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-black text-[#141414]" style={{ letterSpacing: '-0.2px' }}>{partner.firstName}</p>
                <span className="text-[11px] font-normal" style={{ color: 'rgba(20,20,20,0.4)' }}>
                  {isRequester ? '→ You sent' : '← They sent'}
                </span>
              </div>
              <p className="text-sm font-normal" style={{ color: 'rgba(20,20,20,0.5)' }}>
                {TOPIC_EMOJI[m.topic] ?? '💬'} {m.topic.replace('_', ' ')}
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-[11px] font-black rounded-full px-2.5 py-1"
                style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                {style.label}
              </span>
              <span className="text-[11px] font-normal" style={{ color: 'rgba(20,20,20,0.35)' }}>
                {new Date(m.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchHistory;