import React from 'react';
import UserAvatar from './UserAvatar';
import LevelBadge from './LevelBadge';
import TopicPicker from './TopicPicker';
import type { MatchUser } from '../../../lib/matchApi';

const INTEREST_EMOJI: Record<string, string> = {
  daily_life:'☀️', travel:'✈️', food:'🍜', movies:'🎬', tech:'💻',
  sports:'⚽', books:'📚', science:'🔬', business:'💼', art:'🎨', gaming:'🎮', health:'🏃',
};

const INTEREST_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  daily_life: { bg:'#FFF4EF', text:'#E8480C', border:'rgba(232,72,12,0.2)' },
  travel:     { bg:'#EFF6FF', text:'#2563eb', border:'#bfdbfe' },
  food:       { bg:'#FEF8EF', text:'#B45309', border:'rgba(180,83,9,0.2)' },
  tech:       { bg:'#f5f3ff', text:'#7c3aed', border:'#c4b5fd' },
  sports:     { bg:'#F0FAF4', text:'#3D7A5C', border:'rgba(61,122,92,0.22)' },
  movies:     { bg:'#fff1f2', text:'#e11d48', border:'#fecdd3' },
  books:      { bg:'#F0FAF4', text:'#3D7A5C', border:'rgba(61,122,92,0.22)' },
  science:    { bg:'#ecfeff', text:'#0e7490', border:'#a5f3fc' },
  business:   { bg:'#f0f9ff', text:'#0369a1', border:'#bae6fd' },
  art:        { bg:'#fdf4ff', text:'#9333ea', border:'#e9d5ff' },
  gaming:     { bg:'#fdf4ff', text:'#7c3aed', border:'#e9d5ff' },
  health:     { bg:'#F0FAF4', text:'#3D7A5C', border:'rgba(61,122,92,0.22)' },
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
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
      style={{
        border: '1px solid rgba(20,20,20,0.08)',
        transition: 'transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s',
        transform: exiting
          ? `translateX(${exitDir === 'right' ? 120 : -120}%) rotate(${exitDir === 'right' ? 15 : -15}deg)`
          : 'translateX(0) rotate(0deg)',
        opacity: exiting ? 0 : 1,
      }}
    >
      {exiting && (
        <div className={`absolute top-7 z-10 rounded-xl px-4 py-1 font-black text-xl border-2 ${
          exitDir === 'right' ? 'left-6 rotate-[-12deg]' : 'right-6 rotate-[12deg]'}`}
          style={exitDir === 'right'
            ? { borderColor: '#3D7A5C', color: '#3D7A5C' }
            : { borderColor: '#E8480C', color: '#E8480C' }}>
          {exitDir === 'right' ? '✅ REQUEST!' : '❌ SKIP'}
        </div>
      )}

      {/* Top accent strip */}
      <div className="h-1.5" style={{ background: 'linear-gradient(90deg,#E8480C,#B45309,#3D7A5C)' }} />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <UserAvatar user={user} size={76} />
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
              style={{ background: '#3D7A5C' }}>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
            <div className="absolute -top-2 -left-2 text-white text-[9px] font-black rounded-full px-1.5 py-0.5 border-2 border-white shadow-sm"
              style={{ background: '#E8480C' }}>
              🔥{user.streakLength}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-black text-2xl text-[#141414]" style={{ letterSpacing: '-0.5px' }}>{user.firstName}</span>
              <LevelBadge points={user.points} small />
            </div>
            <p className="text-[12px] font-normal mb-1" style={{ color: 'rgba(20,20,20,0.4)' }}>@{user.username}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: 'rgba(20,20,20,0.45)' }}>🇬🇧 English</span>
              <span className="text-xs font-black" style={{ color: '#B45309' }}>🔥 {user.streakLength} day streak</span>
            </div>
          </div>

          <div className="text-right shrink-0 rounded-xl px-3 py-2"
            style={{ background: '#FEF8EF', border: '1px solid rgba(180,83,9,0.2)' }}>
            <p className="text-xl font-black text-[#141414]">{user.points.toLocaleString()}</p>
            <p className="text-xs font-black" style={{ color: '#B45309' }}>⚡ XP</p>
          </div>
        </div>

        {/* Interests */}
        {user.interests?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {user.interests.slice(0, 5).map(i => {
              const style = INTEREST_COLORS[i] ?? { bg: 'rgba(20,20,20,0.05)', text: '#141414', border: 'rgba(20,20,20,0.1)' };
              return (
                <span key={i} className="rounded-full px-3 py-1 text-xs font-black"
                  style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                  {INTEREST_EMOJI[i] ?? '•'} {i.replace('_', ' ')}
                </span>
              );
            })}
          </div>
        )}

        <TopicPicker selected={topic} onChange={onTopic} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 p-5 pt-0">
        <button
          onClick={onSkip}
          className="flex-1 py-3.5 rounded-xl font-black text-base transition-all hover:scale-105 active:scale-95"
          style={{ border: '1px solid rgba(20,20,20,0.1)', color: 'rgba(20,20,20,0.5)', background: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,72,12,0.3)'; e.currentTarget.style.color = '#E8480C'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(20,20,20,0.1)'; e.currentTarget.style.color = 'rgba(20,20,20,0.5)'; }}
        >
          👎 Skip
        </button>
        <button
          onClick={onSend}
          disabled={!topic || sending}
          className="flex-[2] py-3.5 rounded-xl font-black text-base text-white transition-all active:scale-95 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          style={{
            background: (!topic || sending) ? 'rgba(20,20,20,0.1)' : '#E8480C',
            boxShadow: (!topic || sending) ? 'none' : '0 6px 20px rgba(232,72,12,0.35)',
            color: (!topic || sending) ? 'rgba(20,20,20,0.4)' : 'white',
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