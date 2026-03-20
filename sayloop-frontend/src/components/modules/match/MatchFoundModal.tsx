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

const TOPIC_EMOJI: Record<string, string> = {
  daily_life: '☀️', travel: '✈️', food: '🍜', movies: '🎬', tech: '💻',
  sports: '⚽', books: '📚', science: '🔬', business: '💼', art: '🎨', gaming: '🎮', health: '🏃',
};

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

  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const progress = circ - (countdown / 5) * circ;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(20,20,20,0.75)', backdropFilter: 'blur(8px)' }}>
      <style>{`
        @keyframes popIn { from{transform:scale(0.85);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>

      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl"
        style={{ animation: 'popIn 0.4s cubic-bezier(.34,1.56,.64,1)', border: '1px solid rgba(20,20,20,0.08)' }}>

        {/* Header */}
        <div className="px-6 pt-8 pb-6 text-center relative overflow-hidden"
          style={{ background: '#141414' }}>
          <div className="absolute top-0 right-0 text-8xl opacity-5 select-none leading-none">🎉</div>
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-white font-black text-2xl mb-1" style={{ letterSpacing: '-0.5px' }}>Match Found!</h2>
          <p className="text-sm font-normal" style={{ color: 'rgba(255,255,255,0.45)' }}>You're about to have a real English conversation!</p>
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mt-3"
            style={{ background: 'rgba(61,122,92,0.2)', border: '1px solid rgba(61,122,92,0.35)' }}>
            <span className="text-sm font-black" style={{ color: '#3D7A5C' }}>⚡ +25 XP incoming!</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Partner info */}
          <div className="flex items-center gap-4 rounded-xl p-4 mb-4"
            style={{ background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.18)' }}>
            <div className="relative">
              <UserAvatar user={partner} size={56} />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-white"
                style={{ background: '#3D7A5C' }}>✓</div>
            </div>
            <div className="flex-1">
              <p className="font-black text-[#141414] text-lg leading-none mb-0.5" style={{ letterSpacing: '-0.3px' }}>{partner.firstName}</p>
              <p className="text-[12px] font-normal" style={{ color: 'rgba(20,20,20,0.4)' }}>@{partner.username}</p>
              <p className="text-[11px] font-black mt-1" style={{ color: '#B45309' }}>🔥 {partner.streakLength} day streak</p>
            </div>
            <div className="text-right bg-white rounded-xl px-3 py-2" style={{ border: '1px solid rgba(20,20,20,0.08)' }}>
              <p className="font-black text-[#141414]">{partner.points.toLocaleString()}</p>
              <p className="text-[10px] font-black" style={{ color: '#B45309' }}>⚡ XP</p>
            </div>
          </div>

          {/* Topic */}
          <div className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 mb-5"
            style={{ background: '#F0FAF4', border: '1px solid rgba(61,122,92,0.22)' }}>
            <span className="text-2xl">{TOPIC_EMOJI[topic] ?? '💬'}</span>
            <span className="font-black capitalize" style={{ color: '#3D7A5C' }}>{topic.replace('_', ' ')}</span>
          </div>

          {/* Start button with countdown */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-xl text-white font-black text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform active:scale-95"
            style={{ background: '#E8480C', boxShadow: '0 8px 24px rgba(232,72,12,0.35)' }}
          >
            <span>Let's go! →</span>
            <svg width="36" height="36" className="-rotate-90">
              <circle cx="18" cy="18" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <circle cx="18" cy="18" r={radius} fill="none" stroke="white" strokeWidth="3"
                strokeDasharray={circ} strokeDashoffset={progress}
                style={{ transition: 'stroke-dashoffset 1s linear' }} />
              <text x="18" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="900"
                style={{ transform: 'rotate(90deg)', transformOrigin: '18px 18px' }}>
                {countdown}s
              </text>
            </svg>
          </button>

          <p className="text-center text-[11px] font-normal mt-3" style={{ color: 'rgba(20,20,20,0.35)' }}>
            Starting automatically in {countdown} second{countdown !== 1 ? 's' : ''}
          </p>

          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full mt-3 py-3 rounded-xl font-medium text-sm transition-all active:scale-95"
              style={{ border: '1px solid rgba(20,20,20,0.1)', color: 'rgba(20,20,20,0.45)', background: 'transparent' }}
            >
              ✕ Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchFoundModal;