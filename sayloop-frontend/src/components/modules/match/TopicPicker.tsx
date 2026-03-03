import React from 'react';

export const TOPICS = [
  { id: 'daily_life', label: 'Daily Life',    emoji: '☀️' },
  { id: 'travel',     label: 'Travel',        emoji: '✈️' },
  { id: 'food',       label: 'Food',          emoji: '🍜' },
  { id: 'movies',     label: 'Movies',        emoji: '🎬' },
  { id: 'tech',       label: 'Technology',    emoji: '💻' },
  { id: 'sports',     label: 'Sports',        emoji: '⚽' },
  { id: 'books',      label: 'Books',         emoji: '📚' },
  { id: 'science',    label: 'Science',       emoji: '🔬' },
  { id: 'business',   label: 'Business',      emoji: '💼' },
  { id: 'art',        label: 'Art & Design',  emoji: '🎨' },
  { id: 'gaming',     label: 'Gaming',        emoji: '🎮' },
  { id: 'health',     label: 'Health',        emoji: '🏃' },
];

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

const TopicPicker: React.FC<Props> = ({ selected, onChange }) => (
  <div>
    <p className="text-xs font-extrabold text-gray-400 tracking-wider mb-3">PICK A TOPIC TO DEBATE</p>
    <div className="grid grid-cols-4 gap-2">
      {TOPICS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(selected === t.id ? '' : t.id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 font-bold text-xs transition-all
            ${selected === t.id
              ? 'border-orange-400 bg-orange-50 text-orange-600 scale-105 shadow-md'
              : 'border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50/50'
            }`}
        >
          <span className="text-lg">{t.emoji}</span>
          <span className="text-center leading-tight">{t.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default TopicPicker;