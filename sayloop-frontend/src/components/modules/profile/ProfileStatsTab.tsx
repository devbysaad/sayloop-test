import React from 'react';

interface ProfileStats {
  points?: number;
  streakLength?: number;
  rank?: number;
  accuracy?: number;
  lessonsCompleted?: number;
  correctAnswers?: number;
  totalExercises?: number;
}

interface League { name: string; color: string; icon: string }

interface Props {
  profileStats: ProfileStats | null;
  profileLoading: boolean;
  points: number;
  streak: number;
  rank: number | string;
  accuracy: number;
  lessons: number;
  league: League;
}

const SkeletonCard = () => (
  <div className="h-[88px] rounded-[16px] bg-gradient-to-r from-gray-100 via-amber-50 to-gray-100 bg-[length:200%_100%] animate-pulse" />
);

const ProfileStatsTab = ({ profileStats, profileLoading, points, streak, rank, accuracy, lessons, league }: Props) => {
  const statCards = [
    { icon: '🔥', label: 'Day Streak',   value: `${streak}`,             color: 'text-orange-500' },
    { icon: '⚡', label: 'Total XP',     value: points.toLocaleString(), color: 'text-amber-500'  },
    { icon: '🏆', label: 'Global Rank',  value: `#${rank}`,              color: 'text-violet-500' },
    { icon: league.icon, label: 'League',value: league.name,             color: 'text-lime-400'   },
    { icon: '📚', label: 'Lessons Done', value: `${lessons}`,            color: 'text-emerald-500'},
    { icon: '🎯', label: 'Accuracy',     value: `${accuracy}%`,          color: 'text-blue-500'   },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {profileLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map(s => (
            <div
              key={s.label}
              className="group bg-white border-2 border-amber-100 rounded-[16px] p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-[24px] mb-1.5 transition-transform group-hover:scale-110">{s.icon}</div>
              <p className={`font-black text-[20px] ${s.color} m-0 mb-0.5`}>{s.value}</p>
              <p className="font-bold text-[11px] text-gray-400 m-0 uppercase tracking-tight">{s.label}</p>
            </div>
          ))
        }
      </div>

      {!profileLoading && (
        <div className="bg-white border-2 border-amber-100 rounded-[16px] p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2.5">
            <p className="font-black text-gray-900 text-[14px] m-0">Exercise Accuracy</p>
            <span className="font-black text-amber-500 text-[14px]">{accuracy}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(accuracy, 100)}%` }}
            />
          </div>
          <p className="text-gray-400 font-semibold text-[12px] m-0 mt-1.5 italic">
            {profileStats?.correctAnswers ?? 0} correct out of {profileStats?.totalExercises ?? 0} attempts
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileStatsTab;