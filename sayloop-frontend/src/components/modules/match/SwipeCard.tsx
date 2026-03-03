import React from 'react';
import UserAvatar from './UserAvatar';
import LevelBadge from './LevelBadge';
import TopicPicker from './TopicPicker';
import type { MatchUser } from '../../../lib/matchApi'

const LANG_LABEL: Record<string, string> = {
  en:'English 🇬🇧', ar:'Arabic 🇸🇦', zh:'Mandarin 🇨🇳', es:'Spanish 🇪🇸',
  it:'Italian 🇮🇹', fr:'French 🇫🇷', de:'German 🇩🇪', ja:'Japanese 🇯🇵',
  ko:'Korean 🇰🇷', pt:'Portuguese 🇧🇷', tr:'Turkish 🇹🇷', ru:'Russian 🇷🇺',
};

const INTEREST_EMOJI: Record<string, string> = {
  daily_life:'☀️', travel:'✈️', food:'🍜', movies:'🎬', tech:'💻',
  sports:'⚽', books:'📚', science:'🔬', business:'💼', art:'🎨', gaming:'🎮', health:'🏃',
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
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
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
          {exitDir === 'right' ? 'REQUEST!' : 'SKIP'}
        </div>
      )}

      {/* Card body */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <UserAvatar user={user} size={76} />
            <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-black text-2xl text-gray-900">{user.firstName}</span>
              <LevelBadge points={user.points} small />
            </div>
            <p className="text-gray-400 text-sm font-semibold">@{user.username}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-sm font-bold text-gray-600">
                {LANG_LABEL[user.learningLanguage] ?? user.learningLanguage}
              </span>
              <span className="text-xs font-bold text-amber-500">🔥 {user.streakLength} day streak</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-gray-800">{user.points.toLocaleString()}</p>
            <p className="text-xs text-gray-400 font-semibold">XP</p>
          </div>
        </div>

        {/* Interests */}
        {user.interests?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {user.interests.slice(0, 5).map(i => (
              <span key={i} className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs font-bold">
                {INTEREST_EMOJI[i] ?? '•'} {i.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Topic picker */}
        <TopicPicker selected={topic} onChange={onTopic} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 p-5 pt-0">
        <button
          onClick={onSkip}
          className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold text-base
            hover:border-red-300 hover:text-red-400 hover:bg-red-50 transition-all active:scale-95"
        >
          👎 Skip
        </button>
        <button
          onClick={onSend}
          disabled={!topic || sending}
          className="flex-[2] py-3.5 rounded-2xl font-extrabold text-base text-white transition-all active:scale-95
            bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_6px_20px_rgba(251,191,36,0.4)]
            hover:shadow-[0_8px_28px_rgba(251,191,36,0.55)] hover:-translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
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