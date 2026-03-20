import React from 'react';

export const TOPICS = [
  { id: 'daily_life', label: 'Daily Life', emoji: '☀️', color: '#E8480C', bg: '#FFF4EF', border: 'rgba(232,72,12,0.2)' },
  { id: 'travel', label: 'Travel', emoji: '✈️', color: '#2563eb', bg: '#EFF6FF', border: '#bfdbfe' },
  { id: 'food', label: 'Food', emoji: '🍜', color: '#B45309', bg: '#FEF8EF', border: 'rgba(180,83,9,0.2)' },
  { id: 'movies', label: 'Movies', emoji: '🎬', color: '#e11d48', bg: '#fff1f2', border: '#fecdd3' },
  { id: 'tech', label: 'Technology', emoji: '💻', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: '#3D7A5C', bg: '#F0FAF4', border: 'rgba(61,122,92,0.22)' },
  { id: 'books', label: 'Books', emoji: '📚', color: '#3D7A5C', bg: '#F0FAF4', border: 'rgba(61,122,92,0.22)' },
  { id: 'science', label: 'Science', emoji: '🔬', color: '#0e7490', bg: '#ecfeff', border: '#a5f3fc' },
  { id: 'business', label: 'Business', emoji: '💼', color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' },
  { id: 'art', label: 'Art & Design', emoji: '🎨', color: '#9333ea', bg: '#fdf4ff', border: '#e9d5ff' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  { id: 'health', label: 'Health', emoji: '🏃', color: '#3D7A5C', bg: '#F0FAF4', border: 'rgba(61,122,92,0.22)' },
];

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

const TopicPicker: React.FC<Props> = ({ selected, onChange }) => (
  <div>
    <p className="text-[11px] font-black uppercase tracking-widest mb-3"
      style={{ color: 'rgba(20,20,20,0.4)', fontFamily: "'Outfit', sans-serif" }}>
      ⚔️ Pick a topic to practice
    </p>
    <div className="flex flex-wrap gap-2">
      {TOPICS.map(t => {
        const isActive = selected === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(selected === t.id ? '' : t.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs transition-all duration-200 hover:scale-105 active:scale-95"
            style={isActive
              ? { background: t.color, border: `1.5px solid ${t.color}`, color: 'white', boxShadow: `0 4px 14px ${t.color}40`, transform: 'scale(1.07)' }
              : { background: t.bg, border: `1px solid ${t.border}`, color: t.color }
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