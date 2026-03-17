import React from 'react';

export interface Badge {
  icon: string;
  title: string;
  description: string;
  earned: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

const RARITY_STYLES = {
  common:    { border: 'border-gray-300',    glow: '',                                              label: 'Common',    labelColor: 'text-gray-400'   },
  uncommon:  { border: 'border-green-400',   glow: 'shadow-[0_0_12px_rgba(34,197,94,0.3)]',         label: 'Uncommon',  labelColor: 'text-green-500'  },
  rare:      { border: 'border-blue-400',    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]',        label: 'Rare',      labelColor: 'text-blue-500'   },
  epic:      { border: 'border-purple-400',  glow: 'shadow-[0_0_16px_rgba(168,85,247,0.4)]',        label: 'Epic',      labelColor: 'text-purple-400' },
  legendary: { border: 'border-indigo-400',   glow: 'shadow-[0_0_20px_rgba(251,191,36,0.5)]',        label: 'Legendary', labelColor: 'text-indigo-400'  },
};

export const DEFAULT_BADGES: Badge[] = [
  { icon: '🎙️', title: 'First Words',     description: 'Complete your first speaking session',   earned: false, rarity: 'common'    },
  { icon: '🔥', title: 'On Fire',          description: 'Maintain a 7-day speaking streak',       earned: false, rarity: 'common'    },
  { icon: '🌍', title: 'World Speaker',    description: 'Speak with people from 10 countries',    earned: false, rarity: 'uncommon'  },
  { icon: '⚡', title: 'Speed Talker',     description: 'Average response time under 3 seconds',  earned: false, rarity: 'uncommon'  },
  { icon: '🎯', title: 'Debate King',      description: 'Win 10 debate battles',                  earned: false, rarity: 'rare'      },
  { icon: '🧠', title: 'Vocabulary Pro',   description: 'Use 200+ unique words in sessions',      earned: false, rarity: 'rare'      },
  { icon: '💎', title: 'Diamond Streak',   description: 'Maintain a 30-day speaking streak',      earned: false, rarity: 'epic'      },
  { icon: '🌟', title: 'Community Star',   description: 'Receive 50 positive reactions',          earned: false, rarity: 'epic'      },
  { icon: '👑', title: 'Grandmaster',      description: 'Reach Level 10',                         earned: false, rarity: 'legendary' },
  { icon: '🏆', title: 'Season Champion',  description: 'Reach #1 on the weekly leaderboard',     earned: false, rarity: 'legendary' },
];

interface Props {
  badges?: Badge[];
  compact?: boolean;
}

const BadgeGrid: React.FC<Props> = ({ badges = DEFAULT_BADGES, compact = false }) => {
  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);

  return (
    <div>
      {!compact && (
        <div className="flex items-center justify-between mb-3">
          <p className="font-[900] text-[#1a1a26] text-[14px] m-0 font-heading">
            🎖️ Badges
          </p>
          <span className="font-[800] text-[#f59e0b] text-[11px] font-hud">
            {earned.length}/{badges.length}
          </span>
        </div>
      )}

      <div className={`grid ${compact ? 'grid-cols-5 gap-2' : 'grid-cols-5 gap-2.5'}`}>
        {badges.map(badge => {
          const style = RARITY_STYLES[badge.rarity];
          return (
            <div
              key={badge.title}
              className={`group relative flex flex-col items-center justify-center rounded-[14px] border-2 p-2.5 transition-all
                ${badge.earned
                  ? `${style.border} ${style.glow} bg-white hover:scale-105 cursor-pointer`
                  : 'border-gray-200 bg-gray-50 opacity-40 grayscale cursor-default'
                }`}
              title={`${badge.title} — ${badge.description}`}
            >
              <span className={`${compact ? 'text-[18px]' : 'text-[22px]'} mb-1 transition-transform group-hover:scale-110`}>
                {badge.earned ? badge.icon : '🔒'}
              </span>
              {!compact && (
                <p className={`font-[800] text-[8px] m-0 text-center leading-tight uppercase tracking-tight font-heading
                  ${badge.earned ? style.labelColor : 'text-gray-400'}`}>
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
