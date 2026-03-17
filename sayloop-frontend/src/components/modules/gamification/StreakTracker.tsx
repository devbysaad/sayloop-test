import React from 'react';

const MILESTONES = [
  { day: 7,   reward: '+50 XP',   label: '1 Week' },
  { day: 14,  reward: '+100 XP',  label: '2 Weeks' },
  { day: 30,  reward: '+200 XP',  label: '1 Month' },
  { day: 60,  reward: '+500 XP',  label: '2 Months' },
  { day: 100, reward: '+1000 XP', label: 'Century' },
];

interface Props {
  currentStreak: number;
  compact?: boolean;
}

const StreakTracker: React.FC<Props> = ({ currentStreak, compact = false }) => {
  // Find next milestone
  const nextMilestone = MILESTONES.find(m => m.day > currentStreak) ?? MILESTONES[MILESTONES.length - 1];
  const prevMilestone = [...MILESTONES].reverse().find(m => m.day <= currentStreak);
  const progressToNext = nextMilestone.day > currentStreak
    ? ((currentStreak - (prevMilestone?.day ?? 0)) / (nextMilestone.day - (prevMilestone?.day ?? 0))) * 100
    : 100;

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/25 rounded-full px-3 py-1">
        <span className="text-[12px] animate-pulse">🔥</span>
        <span className="font-[900] text-[#7C3AED] text-[12px] font-hud">{currentStreak}</span>
        <span className="font-[700] text-[#9ca3af] text-[10px] font-body">day streak</span>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#E0E7FF] rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] card-lift glow-border h-lines">
      <div className="relative z-[3] flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[24px] animate-pulse drop-shadow-lg">🔥</span>
          <div>
            <p className="font-[900] text-[#1a1a26] text-[14px] m-0 font-heading">
              {currentStreak} Day Streak
            </p>
            <p className="font-[600] text-[#9ca3af] text-[11px] m-0 font-body">
              Keep your fire alive!
            </p>
          </div>
        </div>

        {currentStreak >= 7 && (
          <div className="bg-linear-to-br from-[#6366F1] to-[#7C3AED] text-white font-[900] text-[9px] px-2.5 py-1 rounded-full uppercase tracking-[1px] font-heading shadow-[0_0_12px_rgba(249,115,22,0.3)]">
            🔥 ON FIRE
          </div>
        )}
      </div>

      {/* Progress to next milestone */}
      <div className="relative z-[3]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-[700] text-[#78716c] text-[10px] font-hud">
            Next: {nextMilestone.label}
          </span>
          <span className="font-[800] text-[#f59e0b] text-[10px] font-hud">
            {nextMilestone.reward}
          </span>
        </div>
        <div className="bg-gray-100 rounded-full h-[6px] overflow-hidden progress-segmented">
          <div
            className="h-full bg-linear-to-r from-[#6366F1] to-[#7C3AED] rounded-full transition-all duration-700"
            style={{ width: `${Math.min(progressToNext, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-[700] text-[#9ca3af] text-[9px] font-hud">
            Day {currentStreak}
          </span>
          <span className="font-[700] text-[#9ca3af] text-[9px] font-hud">
            Day {nextMilestone.day}
          </span>
        </div>
      </div>

      {/* Recent milestone badges */}
      {prevMilestone && (
        <div className="relative z-[3] mt-3 flex items-center gap-2 bg-[#fef9f0] border border-[#818CF8] rounded-[10px] px-3 py-2">
          <span className="text-[14px]">🏅</span>
          <span className="font-[700] text-[#d97706] text-[11px] font-body">
            Achieved: {prevMilestone.label} milestone!
          </span>
        </div>
      )}
    </div>
  );
};

export default StreakTracker;
