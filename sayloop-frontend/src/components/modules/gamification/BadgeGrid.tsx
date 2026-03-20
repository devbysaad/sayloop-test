import React from 'react';

export interface Badge {
  icon: string;
  title: string;
  description: string;
  earned: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

const RARITY_STYLES = {
  common: { border: 'rgba(20,20,20,0.15)', glow: '', label: 'Common', color: 'rgba(20,20,20,0.4)' },
  uncommon: { border: 'rgba(61,122,92,0.4)', glow: '0 0 12px rgba(61,122,92,0.25)', label: 'Uncommon', color: '#3D7A5C' },
  rare: { border: 'rgba(37,99,235,0.4)', glow: '0 0 12px rgba(37,99,235,0.25)', label: 'Rare', color: '#2563eb' },
  epic: { border: 'rgba(147,51,234,0.45)', glow: '0 0 16px rgba(147,51,234,0.3)', label: 'Epic', color: '#9333ea' },
  legendary: { border: 'rgba(180,83,9,0.5)', glow: '0 0 20px rgba(180,83,9,0.35)', label: 'Legendary', color: '#B45309' },
};

export const DEFAULT_BADGES: Badge[] = [
  { icon: '🎙️', title: 'First Words', description: 'Complete your first speaking session', earned: false, rarity: 'common' },
  { icon: '🔥', title: 'On Fire', description: 'Maintain a 7-day speaking streak', earned: false, rarity: 'common' },
  { icon: '🌍', title: 'World Speaker', description: 'Speak with people from 10 countries', earned: false, rarity: 'uncommon' },
  { icon: '⚡', title: 'Speed Talker', description: 'Average response time under 3 seconds', earned: false, rarity: 'uncommon' },
  { icon: '🎯', title: 'Debate King', description: 'Win 10 debate battles', earned: false, rarity: 'rare' },
  { icon: '🧠', title: 'Vocabulary Pro', description: 'Use 200+ unique words in sessions', earned: false, rarity: 'rare' },
  { icon: '💎', title: 'Diamond Streak', description: 'Maintain a 30-day speaking streak', earned: false, rarity: 'epic' },
  { icon: '🌟', title: 'Community Star', description: 'Receive 50 positive reactions', earned: false, rarity: 'epic' },
  { icon: '👑', title: 'Grandmaster', description: 'Reach Level 10', earned: false, rarity: 'legendary' },
  { icon: '🏆', title: 'Season Champion', description: 'Reach #1 on the weekly leaderboard', earned: false, rarity: 'legendary' },
];

interface Props {
  badges?: Badge[];
  compact?: boolean;
}

const BadgeGrid: React.FC<Props> = ({ badges = DEFAULT_BADGES, compact = false }) => {
  const earned = badges.filter(b => b.earned);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {!compact && (
        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-[#141414] text-[14px] m-0" style={{ letterSpacing: '-0.2px' }}>🎖️ Badges</p>
          <span className="font-black text-[11px]" style={{ color: '#B45309' }}>{earned.length}/{badges.length}</span>
        </div>
      )}

      <div className={`grid ${compact ? 'grid-cols-5 gap-2' : 'grid-cols-5 gap-2.5'}`}>
        {badges.map(badge => {
          const style = RARITY_STYLES[badge.rarity];
          return (
            <div
              key={badge.title}
              className="group relative flex flex-col items-center justify-center rounded-xl p-2.5 transition-all"
              style={{
                background: badge.earned ? 'white' : 'rgba(20,20,20,0.03)',
                border: `1.5px solid ${badge.earned ? style.border : 'rgba(20,20,20,0.08)'}`,
                boxShadow: badge.earned ? style.glow : 'none',
                opacity: badge.earned ? 1 : 0.4,
                filter: badge.earned ? 'none' : 'grayscale(1)',
                cursor: badge.earned ? 'pointer' : 'default',
              }}
              title={`${badge.title} — ${badge.description}`}
            >
              <span className={`${compact ? 'text-[18px]' : 'text-[22px]'} mb-1 transition-transform group-hover:scale-110 inline-block`}>
                {badge.earned ? badge.icon : '🔒'}
              </span>
              {!compact && (
                <p className="font-black text-[8px] m-0 text-center leading-tight uppercase tracking-tight"
                  style={{ color: badge.earned ? style.color : 'rgba(20,20,20,0.35)' }}>
                  {badge.title}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeGrid;