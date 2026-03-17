import React from 'react';

interface SkillTier {
  name: string;
  icon: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

const TIERS: { min: number; tier: SkillTier }[] = [
  { min: 10000, tier: { name: 'Master',  icon: '👑', color: '#a855f7', bgClass: 'bg-purple-500/10',  borderClass: 'border-purple-500/30', textClass: 'text-purple-400'  } },
  { min: 5000,  tier: { name: 'Diamond', icon: '💎', color: '#60a5fa', bgClass: 'bg-blue-500/10',    borderClass: 'border-blue-500/30',   textClass: 'text-blue-400'    } },
  { min: 2000,  tier: { name: 'Gold',    icon: '🥇', color: '#f59e0b', bgClass: 'bg-indigo-500/10',   borderClass: 'border-indigo-500/30',  textClass: 'text-indigo-500'   } },
  { min: 500,   tier: { name: 'Silver',  icon: '🥈', color: '#9ca3af', bgClass: 'bg-gray-400/10',    borderClass: 'border-gray-400/30',   textClass: 'text-gray-400'    } },
  { min: 0,     tier: { name: 'Bronze',  icon: '🥉', color: '#7C3AED', bgClass: 'bg-violet-500/10',  borderClass: 'border-violet-500/30', textClass: 'text-violet-400'  } },
];

export const getSkillTier = (points: number): SkillTier =>
  TIERS.find(t => points >= t.min)!.tier;

interface Props {
  points: number;
  small?: boolean;
}

const SkillRatingPill: React.FC<Props> = ({ points, small }) => {
  const tier = getSkillTier(points);
  return (
    <div
      className={`inline-flex items-center gap-1 ${tier.bgClass} border ${tier.borderClass} rounded-full
        ${small ? 'px-2 py-0.5' : 'px-2.5 py-1'}`}
    >
      <span className={small ? 'text-[10px]' : 'text-xs'}>{tier.icon}</span>
      <span className={`font-[800] uppercase tracking-tight font-heading ${tier.textClass}
        ${small ? 'text-[9px]' : 'text-[11px]'}`}>
        {tier.name}
      </span>
    </div>
  );
};

export default SkillRatingPill;
