import React from 'react';
import UserAvatar from './UserAvatar';
import LevelBadge from './LevelBadge';
import TopicPicker from './TopicPicker';
import type { MatchUser } from '../../../lib/matchApi'

const INTEREST_EMOJI: Record<string, string> = {
  daily_life:'☀️', travel:'✈️', food:'🍜', movies:'🎬', tech:'💻',
  sports:'⚽', books:'📚', science:'🔬', business:'💼', art:'🎨', gaming:'🎮', health:'🏃',
};

const INTEREST_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  daily_life: { bg:'#fff7ed', text:'#ea580c', border:'#fed7aa' },
  travel:     { bg:'#eff6ff', text:'#2563eb', border:'#bfdbfe' },
  food:       { bg:'#fefce8', text:'#ca8a04', border:'#fde047' },
  tech:       { bg:'#f5f3ff', text:'#7c3aed', border:'#c4b5fd' },
  sports:     { bg:'#dcfce7', text:'#16a34a', border:'#86efac' },
  movies:     { bg:'#fff1f2', text:'#e11d48', border:'#fecdd3' },
  books:      { bg:'#f0fdf4', text:'#15803d', border:'#bbf7d0' },
  science:    { bg:'#ecfeff', text:'#0e7490', border:'#a5f3fc' },
  business:   { bg:'#f0f9ff', text:'#0369a1', border:'#bae6fd' },
  art:        { bg:'#fdf4ff', text:'#9333ea', border:'#e9d5ff' },
  gaming:     { bg:'#fdf4ff', text:'#7c3aed', border:'#e9d5ff' },
  health:     { bg:'#f0fdf4', text:'#16a34a', border:'#86efac' },
};

interface Props {
  user: MatchUser;
  topic: string;
  onTopic: (t: string) => void;
  onSkip: () => void;
  onSend: () => void;
  sending: boolean;
  exiting: boolean;
  exitDir: 'left' | 'right' | null;
}

const SwipeCard: React.FC<Props> = ({ user, topic, onTopic, onSkip, onSend, sending, exiting, exitDir }) => {
  return (
    <div
      className="bg-white rounded-3xl shadow-2xl border-2 border-orange-100 overflow-hidden"
      style={{
        transition: 'transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s',
        transform: exiting
          ? `translateX(${exitDir === 'right' ? 120 : -120}%) rotate(${exitDir === 'right' ? 15 : -15}deg)`
          : 'translateX(0) rotate(0deg)',
        opacity: exiting ? 0 : 1,
      }}
    >
      {/* Stamp overlay */}
      {exiting && (
        <div className={`absolute top-7 z-10 border-4 rounded-2xl px-4 py-1 font-black text-2xl rotate-[-12deg]
          ${exitDir === 'right'
            ? 'left-6 border-green-500 text-green-500'
            : 'right-6 border-red-400 text-red-400 rotate-[12deg]'}`}
        >
          {exitDir === 'right' ? '✅ REQUEST!' : '❌ SKIP'}
        </div>
      )}

      {/* Card header gradient strip */}
      <div className="h-2" style={{ background: 'linear-gradient(90deg,#FF6B35,#FFC857,#A259FF)' }} />

      {/* Card body */}
      <div className="p-6">
        {/* Header row */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <UserAvatar user={user} size={76} />
            {/* Online dot */}
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
            {/* Streak badge */}
            <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.5 border-2 border-white shadow-sm">
              🔥{user.streakLength}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-black text-2xl text-gray-900">{user.firstName}</span>
              <LevelBadge points={user.points} small />
            </div>
            <p className="text-gray-400 text-sm font-semibold mb-1">@{user.username}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">🇬🇧 English</span>
              <span className="text-xs font-black text-orange-500">🔥 {user.streakLength} day streak</span>
            </div>
          </div>

          {/* XP display */}
          <div className="text-right shrink-0 bg-yellow-50 border-2 border-yellow-200 rounded-2xl px-3 py-2">
            <p className="text-xl font-black text-gray-800">{user.points.toLocaleString()}</p>
            <p className="text-xs text-yellow-600 font-black">⚡ XP</p>
          </div>
        </div>

        {/* Interests chips */}
        {user.interests?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {user.interests.slice(0, 5).map(i => {
              const style = INTEREST_COLORS[i] ?? { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
              return (
                <span key={i}
                  className="rounded-full px-3 py-1 text-xs font-black border-2"
                  style={{ background: style.bg, color: style.text, borderColor: style.border }}
                >
                  {INTEREST_EMOJI[i] ?? '•'} {i.replace('_', ' ')}
                </span>
              );
            })}
          </div>
        )}

        {/* Topic picker */}
        <TopicPicker selected={topic} onChange={onTopic} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 p-5 pt-0">
        <button
          onClick={onSkip}
          className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-500 font-black text-base
            hover:border-red-300 hover:text-red-400 hover:bg-red-50 hover:scale-105 transition-all active:scale-95"
        >
          👎 Skip
        </button>
        <button
          onClick={onSend}
          disabled={!topic || sending}
          className="flex-[2] py-3.5 rounded-2xl font-black text-base text-white transition-all active:scale-95
            hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          style={{
            background: (!topic || sending) ? '#d1d5db' : 'linear-gradient(135deg,#FF6B35,#FFC857)',
            boxShadow: (!topic || sending) ? 'none' : '0 8px 24px rgba(255,107,53,0.45)',
          }}
        >
          {sending
            ? <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending…
              </span>
            : '🤝 Send Request'}
        </button>
      </div>
    </div>
  );
};

export default SwipeCard;