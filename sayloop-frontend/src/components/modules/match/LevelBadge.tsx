import React from 'react';

const LEVELS = [
  { min: 10000, label: 'Diamond', color: '#60a5fa', bg: '#eff6ff', icon: '💎' },
  { min: 5000,  label: 'Gold',    color: '#f59e0b', bg: '#fffbeb', icon: '🥇' },
  { min: 2000,  label: 'Silver',  color: '#6b7280', bg: '#f9fafb', icon: '🥈' },
  { min: 500,   label: 'Bronze',  color: '#b45309', bg: '#fefce8', icon: '🥉' },
  { min: 0,     label: 'Rookie',  color: '#d97706', bg: '#fffbeb', icon: '⭐' },
];

export function getLevel(points: number) {
  return LEVELS.find(l => points >= l.min)!;
}

interface Props {
  points: number;
  small?: boolean;
}

const LevelBadge: React.FC<Props> = ({ points, small = false }) => {
  const lvl = getLevel(points);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-extrabold"
      style={{
        background: lvl.bg,
        color: lvl.color,
        border: `1.5px solid ${lvl.color}40`,
        padding: small ? '2px 8px' : '4px 12px',
        fontSize: small ? 11 : 12,
      }}
    >
      {lvl.icon} {lvl.label}
    </span>
  );
};

export default LevelBadge;