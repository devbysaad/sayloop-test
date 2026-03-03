import React, { useEffect, useState } from 'react';
import UserAvatar from './UserAvatar';
import type { MatchUser } from '../../../lib/matchApi';

interface Props {
  partner: MatchUser;
  topic: string;
  sessionId: string;
  onStart: () => void;   // navigate to session
  onCancel?: () => void; // dismiss the modal
}

const MatchFoundModal: React.FC<Props> = ({ partner, topic, onStart, onCancel }) => {
  const [countdown, setCountdown] = useState(5);

  // Auto-start after 5 seconds
  useEffect(() => {
    if (countdown <= 0) { onStart(); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onStart]);

  const TOPIC_EMOJI: Record<string, string> = {
    daily_life: '☀️', travel: '✈️', food: '🍜', movies: '🎬', tech: '💻',
    sports: '⚽', books: '📚', science: '🔬', business: '💼', art: '🎨', gaming: '🎮', health: '🏃',
  };

  // circumference for SVG countdown ring
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const progress = circ - (countdown / 5) * circ;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>

      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
        style={{ animation: 'popIn 0.4s cubic-bezier(.34,1.56,.64,1)' }}>

        {/* Green banner */}
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 px-6 pt-8 pb-6 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-white font-black text-2xl mb-1">Match Found!</h2>
          <p className="text-white/80 font-semibold text-sm">Both of you are ready to debate</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Partner info */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mb-5">
            <div className="relative">
              <UserAvatar user={partner} size={56} />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-white
                flex items-center justify-center text-xs">✓</div>
            </div>
            <div className="flex-1">
              <p className="font-black text-gray-900 text-lg">{partner.firstName}</p>
              <p className="text-gray-400 text-sm font-semibold">@{partner.username}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-gray-800">{partner.points.toLocaleString()}</p>
              <p className="text-gray-400 text-xs">XP</p>
            </div>
          </div>

          {/* Topic */}
          <div className="flex items-center justify-center gap-2 bg-amber-50 border-2 border-amber-200
            rounded-xl px-4 py-3 mb-6">
            <span className="text-2xl">{TOPIC_EMOJI[topic] ?? '💬'}</span>
            <span className="text-amber-800 font-extrabold capitalize">{topic.replace('_', ' ')}</span>
          </div>

          {/* Start button with countdown ring */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500
              text-white font-black text-lg flex items-center justify-center gap-3
              shadow-[0_8px_24px_rgba(251,191,36,0.45)] hover:shadow-[0_12px_32px_rgba(251,191,36,0.55)]
              hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <span>Let's go! 🚀</span>
            {/* SVG countdown ring */}
            <svg width="36" height="36" className="-rotate-90">
              <circle cx="18" cy="18" r={radius} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
              <circle cx="18" cy="18" r={radius} fill="none" stroke="white" strokeWidth="3"
                strokeDasharray={circ} strokeDashoffset={progress}
                style={{ transition: 'stroke-dashoffset 1s linear' }} />
              <text x="18" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="900"
                style={{ transform: 'rotate(90deg)', transformOrigin: '18px 18px' }}>
                {countdown}s
              </text>
            </svg>
          </button>

          <p className="text-center text-gray-400 text-xs font-semibold mt-3">
            Starting automatically in {countdown} second{countdown !== 1 ? 's' : ''}
          </p>

          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full mt-3 py-3 rounded-2xl border-2 border-gray-200 text-gray-500
                font-bold text-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50
                transition-all active:scale-95"
            >
              ✕ Cancel
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MatchFoundModal;