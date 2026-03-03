import React, { useState } from 'react';
import UserAvatar from './UserAvatar';
import MatchFoundModal from './MatchFoundModal';
import { acceptMatch, rejectMatch, type Match, type MatchUser } from '../../../lib/matchApi';

interface Props {
  requests: Match[];
  loading: boolean;
  myUserId: number;
  onUpdate: (matchId: number) => void;
  onToast: (msg: string, type?: 'success' | 'error') => void;
  onStartSession: (sessionId: string) => void;
}

const TOPIC_EMOJI: Record<string, string> = {
  daily_life:'☀️', travel:'✈️', food:'🍜', movies:'🎬', tech:'💻',
  sports:'⚽', books:'📚', science:'🔬', business:'💼', art:'🎨', gaming:'🎮', health:'🏃',
};

const IncomingRequests: React.FC<Props> = ({
  requests, loading, onUpdate, onToast, onStartSession,
}) => {
  // When this user accepts, show the modal before navigating
  const [acceptedMatch, setAcceptedMatch] = useState<{
    sessionId: string; partner: MatchUser; topic: string;
  } | null>(null);

  const handleAccept = async (match: Match) => {
    try {
      const result = await acceptMatch(match.id);
      onUpdate(match.id);
      if (result?.sessionId) {
        // Show the "Match Found" modal — auto-navigates after countdown
        setAcceptedMatch({
          sessionId: result.sessionId,
          partner:   match.requester as MatchUser,
          topic:     match.topic,
        });
      } else {
        onStartSession('');
      }
    } catch (err: any) {
      onToast(err?.response?.data?.message ?? 'Failed to accept', 'error');
    }
  };

  const handleReject = async (matchId: number) => {
    try {
      await rejectMatch(matchId);
      onToast('Request declined.');
      onUpdate(matchId);
    } catch (err: any) {
      onToast(err?.response?.data?.message ?? 'Failed to reject', 'error');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (requests.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">📭</div>
      <p className="text-gray-500 font-bold text-lg">No pending requests</p>
      <p className="text-gray-400 text-sm mt-1">
        When someone sends you a debate request it will show here.
      </p>
    </div>
  );

  return (
    <>
      {/* Match found modal (shown after accepting) */}
      {acceptedMatch && (
        <MatchFoundModal
          partner={acceptedMatch.partner}
          topic={acceptedMatch.topic}
          sessionId={acceptedMatch.sessionId}
          onStart={() => onStartSession(acceptedMatch.sessionId)}
        />
      )}

      <div className="flex flex-col gap-4">
        {requests.map(m => (
          <div key={m.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <UserAvatar user={m.requester} size={48} />
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-gray-900">{m.requester.firstName}</p>
                <p className="text-gray-400 text-sm font-semibold">@{m.requester.username}</p>
              </div>
              <span className="text-xs font-bold text-gray-400">
                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
              <span className="text-xl">{TOPIC_EMOJI[m.topic] ?? '💬'}</span>
              <p className="text-amber-800 font-bold text-sm">
                Wants to debate: <span className="capitalize">{m.topic.replace('_', ' ')}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleReject(m.id)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm
                  hover:border-red-300 hover:text-red-400 hover:bg-red-50 transition-all"
              >
                Decline
              </button>
              <button
                onClick={() => handleAccept(m)}
                className="flex-[2] py-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500
                  text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
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