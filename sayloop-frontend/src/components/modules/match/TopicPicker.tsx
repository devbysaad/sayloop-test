import React from 'react';

export const TOPICS = [
  { id: 'daily_life', label: 'Daily Life',   emoji: '☀️', color: '#FF6B35' },
  { id: 'travel',     label: 'Travel',       emoji: '✈️', color: '#3B82F6' },
  { id: 'food',       label: 'Food',         emoji: '🍜', color: '#EAB308' },
  { id: 'movies',     label: 'Movies',       emoji: '🎬', color: '#EC4899' },
  { id: 'tech',       label: 'Technology',   emoji: '💻', color: '#A259FF' },
  { id: 'sports',     label: 'Sports',       emoji: '⚽', color: '#22C55E' },
  { id: 'books',      label: 'Books',        emoji: '📚', color: '#16A34A' },
  { id: 'science',    label: 'Science',      emoji: '🔬', color: '#06B6D4' },
  { id: 'business',   label: 'Business',     emoji: '💼', color: '#0EA5E9' },
  { id: 'art',        label: 'Art & Design', emoji: '🎨', color: '#F43F5E' },
  { id: 'gaming',     label: 'Gaming',       emoji: '🎮', color: '#8B5CF6' },
  { id: 'health',     label: 'Health',       emoji: '🏃', color: '#10B981' },
];

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

const TopicPicker: React.FC<Props> = ({ selected, onChange }) => (
  <div>
    <p className="text-xs font-black text-gray-400 tracking-widest mb-3 uppercase">⚔️ Pick a topic to debate</p>
    <div className="flex flex-wrap gap-2">
      {TOPICS.map(t => {
        const isActive = selected === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(selected === t.id ? '' : t.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 font-black text-xs transition-all duration-200 hover:scale-105 active:scale-95"
            style={
              isActive
                ? { background: t.color, borderColor: t.color, color: 'white', boxShadow: `0 4px 14px ${t.color}55`, transform: 'scale(1.07)' }
                : { background: '#f9fafb', borderColor: '#e5e7eb', color: '#4b5563' }
            }
          >
            <span className="text-base">{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default TopicPicker;