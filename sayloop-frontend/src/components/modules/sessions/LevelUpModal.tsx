import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { clearLevelUp } from '../../../redux/slice/economy.slice';

// ── Level title lookup (client-side mirror of backend level.utils.js) ────────
function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: 'Newbie', 2: 'Beginner', 3: 'Speaker', 4: 'Talker', 5: 'Debater',
    6: 'Orator', 7: 'Influencer', 8: 'Champion', 9: 'Legend', 10: 'Grandmaster',
  };
  return titles[level] ?? 'Newbie';
}

// ── Confetti particle ─────────────────────────────────────────────────────────
const Confetti = () => {
  const colors = ['#E8480C', '#3D7A5C', '#B45309', '#3B82F6', '#8B5CF6', '#EC4899'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 32 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-12px',
            background: colors[i % colors.length],
            animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in forwards`,
            animationDelay: `${Math.random() * 0.8}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%  { top: -12px; opacity: 1; transform: rotate(0deg) scale(1); }
          80% { opacity: 1; }
          100%{ top: 110%; opacity: 0; transform: rotate(720deg) scale(0.5); }
        }
      `}</style>
    </div>
  );
};

// ── Level ring animation ──────────────────────────────────────────────────────
const LevelRing = ({ level }: { level: number }) => (
  <div className="relative flex items-center justify-center w-36 h-36 mb-6">
    <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(232,72,12,0.12)" strokeWidth="8" />
      <circle
        cx="50" cy="50" r="44" fill="none" stroke="#E8480C" strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="276"
        strokeDashoffset="0"
        style={{ animation: 'strokeDraw 1s ease-out forwards', opacity: 0.9 }}
      />
    </svg>
    <div className="flex flex-col items-center z-10">
      <span className="text-5xl font-black text-[#141414]" style={{ lineHeight: 1 }}>{level}</span>
      <span className="text-[10px] font-black uppercase tracking-[2px] mt-1" style={{ color: '#E8480C' }}>LEVEL</span>
    </div>
    <style>{`
      @keyframes strokeDraw {
        from { stroke-dashoffset: 276; opacity: 0; }
        to   { stroke-dashoffset: 0;   opacity: 0.9; }
      }
    `}</style>
  </div>
);

// ── Main Modal ────────────────────────────────────────────────────────────────
const LevelUpModal = () => {
  const dispatch = useDispatch();
  const { levelledUp, level, gems, pendingReward } = useSelector((s: RootState) => s.economy);

  useEffect(() => {
    if (!levelledUp) return;
    // Auto-dismiss after 8 seconds
    const timer = setTimeout(() => dispatch(clearLevelUp()), 8000);
    return () => clearTimeout(timer);
  }, [levelledUp, dispatch]);

  if (!levelledUp) return null;

  const title = getLevelTitle(level);
  const gemsFromLevel = pendingReward?.levelledUp ? pendingReward.gemsEarned : 0;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', fontFamily: "'Outfit', sans-serif" }}
      onClick={() => dispatch(clearLevelUp())}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800;900&display=swap');
        @keyframes modalPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0%, 100% { box-shadow: 0 0 0px rgba(232,72,12,0.0); }
          50%        { box-shadow: 0 0 40px rgba(232,72,12,0.35), 0 0 80px rgba(232,72,12,0.15); }
        }
      `}</style>

      <div
        className="relative w-full max-w-sm bg-white rounded-3xl p-8 text-center overflow-hidden"
        style={{ animation: 'modalPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both, shimmer 2s ease-in-out 0.6s infinite' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti />

        {/* Header badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5"
          style={{ background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.2)' }}>
          <span className="text-sm">🎉</span>
          <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#E8480C' }}>Level Up!</span>
        </div>

        <LevelRing level={level} />

        <h1 className="text-2xl font-black text-[#141414] mb-1" style={{ letterSpacing: '-0.5px' }}>
          You are now a{/^[AEIOU]/i.test(title) ? 'n' : ''} {title}!
        </h1>
        <p className="text-sm font-normal mb-6" style={{ color: 'rgba(20,20,20,0.5)' }}>
          Keep practicing — your next level awaits.
        </p>

        {/* Rewards row */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex flex-col items-center gap-1 rounded-2xl px-4 py-3"
            style={{ background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.15)' }}>
            <span className="text-xl">⚡</span>
            <span className="text-sm font-black text-[#141414]">+20 XP</span>
            <span className="text-[10px] font-medium" style={{ color: 'rgba(20,20,20,0.4)' }}>bonus</span>
          </div>
          {gemsFromLevel > 0 && (
            <div className="flex flex-col items-center gap-1 rounded-2xl px-4 py-3"
              style={{ background: '#F0FAF4', border: '1px solid rgba(61,122,92,0.2)' }}>
              <span className="text-xl">💎</span>
              <span className="text-sm font-black text-[#3D7A5C]">+{gemsFromLevel} Gems</span>
              <span className="text-[10px] font-medium" style={{ color: 'rgba(20,20,20,0.4)' }}>awarded</span>
            </div>
          )}
        </div>

        <button
          onClick={() => dispatch(clearLevelUp())}
          className="w-full py-3.5 rounded-2xl text-white font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: '#E8480C', boxShadow: '0 6px 20px rgba(232,72,12,0.35)' }}
        >
          Keep Going! →
        </button>

        <p className="text-[10px] font-normal mt-3" style={{ color: 'rgba(20,20,20,0.3)' }}>
          Click anywhere to dismiss
        </p>
      </div>
    </div>
  );
};

export default LevelUpModal;
