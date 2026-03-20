import React, { useState } from 'react';
import UserAvatar from './UserAvatar';
import MatchFoundModal from './MatchFoundModal';
import type { Match, MatchUser } from '../../../lib/matchApi';
import { RequestCardSkeleton } from '../../ui/SkeletonCard';

interface Props {
  requests: Match[];
  loading: boolean;
  myUserId: number;
  onAccept: (match: Match) => void;
  onReject: (matchId: number) => void;
  onStartSession: (sessionId: string) => void;
}

const TOPIC_EMOJI: Record<string, string> = {
  daily_life: '☀️', travel: '✈️', food: '🍜', movies: '🎬', tech: '💻',
  sports: '⚽', books: '📚', science: '🔬', business: '💼', art: '🎨', gaming: '🎮', health: '🏃',
};

const IncomingRequests: React.FC<Props> = ({ requests, loading, myUserId, onAccept, onReject, onStartSession }) => {
  const [acceptedMatch, setAcceptedMatch] = useState<{ sessionId: string; partner: MatchUser; topic: string } | null>(null);

  if (loading) return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map(i => <RequestCardSkeleton key={i} />)}
    </div>
  );

  if (requests.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">📭</div>
      <p className="font-black text-[#141414] text-lg" style={{ letterSpacing: '-0.3px' }}>No pending requests</p>
      <p className="text-sm font-normal mt-1" style={{ color: 'rgba(20,20,20,0.45)' }}>
        When someone sends you a request it will show here.
      </p>
    </div>
  );

  return (
    <>
      {acceptedMatch && (
        <MatchFoundModal
          partner={acceptedMatch.partner}
          topic={acceptedMatch.topic}
          sessionId={acceptedMatch.sessionId}
          onStart={() => onStartSession(acceptedMatch.sessionId)}
        />
      )}

      <div className="flex flex-col gap-3">
        {requests.map(m => (
          <div key={m.id} className="bg-white rounded-xl p-4 shadow-sm"
            style={{ border: '1px solid rgba(20,20,20,0.08)' }}>
            <div className="flex items-center gap-3 mb-3">
              <UserAvatar user={m.requester} size={48} />
              <div className="flex-1 min-w-0">
                <p className="font-black text-[#141414]" style={{ letterSpacing: '-0.2px' }}>{m.requester.firstName}</p>
                <p className="text-[12px] font-normal" style={{ color: 'rgba(20,20,20,0.4)' }}>@{m.requester.username}</p>
              </div>
              <span className="text-[11px] font-normal" style={{ color: 'rgba(20,20,20,0.35)' }}>
                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="rounded-xl px-3 py-2 mb-4 flex items-center gap-2"
              style={{ background: '#FEF8EF', border: '1px solid rgba(180,83,9,0.2)' }}>
              <span className="text-xl">{TOPIC_EMOJI[m.topic] ?? '💬'}</span>
              <p className="font-medium text-sm" style={{ color: '#B45309' }}>
                Wants to practice: <span className="font-black capitalize">{m.topic.replace('_', ' ')}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onReject(m.id)}
                className="flex-1 py-2.5 rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95"
                style={{ border: '1px solid rgba(20,20,20,0.1)', color: 'rgba(20,20,20,0.5)', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,72,12,0.3)'; e.currentTarget.style.color = '#E8480C'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(20,20,20,0.1)'; e.currentTarget.style.color = 'rgba(20,20,20,0.5)'; }}
              >
                Decline
              </button>
              <button
                onClick={() => onAccept(m)}
                className="flex-[2] py-2.5 rounded-xl text-white font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
                style={{ background: '#E8480C', boxShadow: '0 4px 14px rgba(232,72,12,0.3)' }}
              >
                🎉 Accept & Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default IncomingRequests;