import React from 'react';

const LEVELS = [
  { min: 10000, label: 'Diamond', color: '#60a5fa', bg: '#EFF6FF', icon: '💎' },
  { min: 5000, label: 'Gold', color: '#B45309', bg: '#FEF8EF', icon: '🥇' },
  { min: 2000, label: 'Silver', color: 'rgba(20,20,20,0.5)', bg: 'rgba(20,20,20,0.05)', icon: '🥈' },
  { min: 500, label: 'Bronze', color: '#E8480C', bg: '#FFF4EF', icon: '🥉' },
  { min: 0, label: 'Rookie', color: '#3D7A5C', bg: '#F0FAF4', icon: '⭐' },
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
      className="inline-flex items-center gap-1 rounded-full font-black"
      style={{
        background: lvl.bg,
        color: lvl.color,
        border: `1px solid ${lvl.color}30`,
        padding: small ? '2px 8px' : '4px 12px',
        fontSize: small ? 11 : 12,
      }}
    >
      {lvl.icon} {lvl.label}
    </span>
  );
};

export default LevelBadge;