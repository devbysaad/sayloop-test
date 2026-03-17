import React from 'react';
import UserAvatar from './UserAvatar';
import type { Match } from  '../../../lib/matchApi';
import { HistoryRowSkeleton } from '../../ui/SkeletonCard';

interface Props {
  history: Match[];
  loading: boolean;
  myUserId: number;
}

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  completed: { label: 'Completed', cls: 'bg-green-100 text-green-700' },
  rejected:  { label: 'Declined',  cls: 'bg-red-100 text-red-500'    },
  expired:   { label: 'Expired',   cls: 'bg-gray-100 text-gray-500'  },
  accepted:  { label: 'Active',    cls: 'bg-blue-100 text-blue-600'  },
  pending:   { label: 'Pending',   cls: 'bg-amber-100 text-amber-600'},
};

const TOPIC_EMOJI: Record<string, string> = {
  daily_life:'☀️', travel:'✈️', food:'🍜', movies:'🎬', tech:'💻',
  sports:'⚽', books:'📚', science:'🔬', business:'💼', art:'🎨', gaming:'🎮', health:'🏃',
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
      <p className="text-gray-500 font-bold text-lg">No history yet</p>
      <p className="text-gray-400 text-sm mt-1">Your past debate requests will appear here.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {history.map(m => {
        const isRequester = m.requesterId === myUserId;
        const partner = isRequester ? m.receiver : m.requester;
        const style = STATUS_STYLE[m.status] ?? STATUS_STYLE.expired;

        return (
          <div key={m.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <UserAvatar user={partner} size={44} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-extrabold text-gray-900">{partner.firstName}</p>
                <span className="text-xs">
                  {isRequester ? '→ You sent' : '← They sent'}
                </span>
              </div>
              <p className="text-gray-500 text-sm font-semibold">
                {TOPIC_EMOJI[m.topic] ?? '💬'} {m.topic.replace('_', ' ')}
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className={`text-xs font-extrabold rounded-full px-2.5 py-1 ${style.cls}`}>
                {style.label}
              </span>
              <span className="text-xs text-gray-400">
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