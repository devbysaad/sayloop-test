import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import UserAvatar from './UserAvatar';
import type { MatchUser } from '../../../lib/matchApi';

/**
 * Polling is now handled by match.saga (handleSendRequest → pollMatchStatus).
 * This component just reads mode from Redux and shows status.
 * Parent (MatchPage) switches away when mode flips to 'matched'.
 */
interface Props {
  partner: MatchUser;
  topic:   string;
  onCancel: () => void;
}

const TOPIC_EMOJI: Record<string, string> = {
  daily_life:'☀️', travel:'✈️', food:'🍜', movies:'🎬', tech:'💻',
  sports:'⚽', books:'📚', science:'🔬', business:'💼', art:'🎨', gaming:'🎮', health:'🏃',
};

const WaitingScreen = ({ partner, topic, onCancel }: Props) => {
  const [seconds, setSeconds] = useState(0);
  const [dots, setDots]       = useState('');

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#fffbf5] flex flex-col items-center justify-center px-6">

      {/* Pulsing ring */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full animate-ping bg-amber-300 opacity-25 scale-150" />
        <div className="absolute inset-0 rounded-full animate-pulse bg-amber-200 opacity-30 scale-125" />
        <UserAvatar user={partner} size={96} />
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 border-2 border-white
          flex items-center justify-center text-sm">⏳</div>
      </div>

      <h2 className="font-black text-3xl text-gray-900 mb-2 text-center">
        Waiting for {partner.firstName}{dots}
      </h2>
      <p className="text-gray-400 font-semibold text-sm mb-6 text-center">
        Saga is polling every 3s — hang tight!
      </p>

      {/* Topic chip */}
      <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-full px-5 py-2.5 mb-10">
        <span className="text-xl">{TOPIC_EMOJI[topic] ?? '💬'}</span>
        <span className="text-amber-800 font-extrabold text-sm capitalize">{topic.replace('_', ' ')}</span>
      </div>

      {/* Partner card */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <UserAvatar user={partner} size={44} />
          <div>
            <p className="font-extrabold text-gray-900">{partner.firstName}</p>
            <p className="text-gray-400 text-xs font-semibold">@{partner.username}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-black text-gray-800">{partner.points.toLocaleString()}</p>
            <p className="text-gray-400 text-xs">XP</p>
          </div>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 flex items-center gap-3">
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-amber-400"
                style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <p className="text-amber-700 font-bold text-xs">Polling for their response…</p>
        </div>
      </div>

      <p className="text-gray-300 text-xs font-semibold mb-8">{seconds}s elapsed</p>

      <button onClick={onCancel}
        className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors">
        Cancel request ✕
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default WaitingScreen;