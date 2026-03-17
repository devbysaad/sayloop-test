import React, { useEffect, useState, useRef } from 'react';
import UserAvatar from './UserAvatar';
import type { MatchUser } from '../../../lib/matchApi';

interface Props {
  partner: MatchUser;
  topic: string;
  sessionId: string;
  onStart: () => void;
  onCancel?: () => void;
}

const MatchFoundModal: React.FC<Props> = ({ partner, topic, onStart, onCancel }) => {
  const [countdown, setCountdown] = useState(5);
  const hasFired = useRef(false);
  const onStartRef = useRef(onStart);
  onStartRef.current = onStart;

  useEffect(() => {
    if (countdown <= 0 && !hasFired.current) {
      hasFired.current = true;
      onStartRef.current();
      return;
    }
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const TOPIC_EMOJI: Record<string, string> = {
    daily_life: '☀️', travel: '✈️', food: '🍜', movies: '🎬', tech: '💻',
    sports: '⚽', books: '📚', science: '🔬', business: '💼', art: '🎨', gaming: '🎮', health: '🏃',
  };

  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const progress = circ - (countdown / 5) * circ;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>

      <div className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl"
        style={{ animation: 'popIn 0.45s cubic-bezier(.34,1.56,.64,1)' }}>

        {/* Gradient header */}
        <div className="px-6 pt-8 pb-6 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#FF6B35,#FFC857)' }}>
          <div className="absolute top-0 right-0 text-8xl opacity-10 select-none leading-none">🎉</div>
          <div className="text-6xl mb-3">🎉</div>
          <h2 className="text-white font-black text-2xl mb-1">Match Found!</h2>
          <p className="text-white/85 font-semibold text-sm">You're about to have a real English conversation!</p>
          {/* XP incoming badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-1.5 mt-3">
            <span className="text-white text-sm font-black">⚡ +25 XP incoming!</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Partner info */}
          <div className="flex items-center gap-4 rounded-2xl p-4 mb-5 border-2 border-orange-100 bg-orange-50">
            <div className="relative">
              <UserAvatar user={partner} size={56} />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-400 border-2 border-white flex items-center justify-center text-xs font-black text-white">✓</div>
            </div>
            <div className="flex-1">
              <p className="font-black text-gray-900 text-lg leading-none mb-0.5">{partner.firstName}</p>
              <p className="text-gray-400 text-sm font-semibold">@{partner.username}</p>
              <p className="text-orange-500 text-xs font-black mt-1">🔥 {partner.streakLength} day streak</p>
            </div>
            <div className="text-right bg-white rounded-xl border border-yellow-200 px-3 py-2">
              <p className="font-black text-gray-800">{partner.points.toLocaleString()}</p>
              <p className="text-yellow-600 text-[10px] font-black">⚡ XP</p>
            </div>
          </div>

          {/* Topic chip */}
          <div className="flex items-center justify-center gap-2 bg-orange-50 border-2 border-orange-200 rounded-2xl px-4 py-3 mb-6">
            <span className="text-2xl">{TOPIC_EMOJI[topic] ?? '💬'}</span>
            <span className="text-orange-700 font-black capitalize">{topic.replace('_', ' ')}</span>
          </div>

          {/* Start button with countdown ring */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg,#FF6B35,#FFC857)', boxShadow: '0 10px 28px rgba(255,107,53,0.45)' }}
          >
            <span>Let's go! 🚀</span>
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
              className="w-full mt-3 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
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