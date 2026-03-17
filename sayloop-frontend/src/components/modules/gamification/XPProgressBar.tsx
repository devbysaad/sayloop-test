import React from 'react';

// ── Level thresholds ──────────────────────────────────────────────────────────
const LEVELS = [
  { level: 1,  title: 'Newbie',       xp: 0     },
  { level: 2,  title: 'Beginner',     xp: 100   },
  { level: 3,  title: 'Speaker',      xp: 300   },
  { level: 4,  title: 'Talker',       xp: 600   },
  { level: 5,  title: 'Debater',      xp: 1000  },
  { level: 6,  title: 'Orator',       xp: 1800  },
  { level: 7,  title: 'Influencer',   xp: 3000  },
  { level: 8,  title: 'Champion',     xp: 5000  },
  { level: 9,  title: 'Legend',       xp: 8000  },
  { level: 10, title: 'Grandmaster',  xp: 12000 },
];

export const getLevelInfo = (totalXP: number) => {
  let current = LEVELS[0];
  let next = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].xp) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? LEVELS[i]; // max level stays at last
      break;
    }
  }

  const isMax = current.level === 10;
  const xpInLevel = totalXP - current.xp;
  const xpNeeded = isMax ? 1 : next.xp - current.xp;
  const progress = isMax ? 100 : Math.min((xpInLevel / xpNeeded) * 100, 100);
  const xpRemaining = isMax ? 0 : next.xp - totalXP;

  return { current, next, xpInLevel, xpNeeded, progress, xpRemaining, isMax };
};

interface Props {
  totalXP: number;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const XPProgressBar: React.FC<Props> = ({ totalXP, animated = true, size = 'md', showLabel = true }) => {
  const { current, next, progress, xpRemaining, isMax } = getLevelInfo(totalXP);

  const heights = { sm: 'h-[6px]', md: 'h-[8px]', lg: 'h-[10px]' };
  const textSizes = { sm: 'text-[9px]', md: 'text-[10px]', lg: 'text-[11px]' };

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-[#FF6B35] ${size === 'sm' ? 'text-[11px]' : 'text-[13px]'} uppercase tracking-tight`}>
              ⚡ Lv.{current.level} {current.title}
            </span>
          </div>
          <span className={`font-semibold text-gray-400 ${textSizes[size]}`}>
            {isMax ? '✨ MAX LEVEL' : `${xpRemaining.toLocaleString()} XP to Lv.${next.level}`}
          </span>
        </div>
      )}

      <div className={`bg-gray-100 ${heights[size]} rounded-full overflow-hidden relative`}>
        <div
          className={`h-full rounded-full ${animated ? '' : ''}`}
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg,#FF6B35,#FFC857)',
            boxShadow: '0 0 10px rgba(255,107,53,0.45)',
            transition: 'width 1.2s ease',
          }}
        />
      </div>

      {showLabel && (
        <div className="flex items-center justify-between mt-1">
          <span className={`font-black text-[#FF6B35] ${textSizes[size]}`}>
            {totalXP.toLocaleString()} XP
          </span>
          {!isMax && (
            <span className={`font-semibold text-gray-400 ${textSizes[size]}`}>
              {next.xp.toLocaleString()} XP
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default XPProgressBar;
