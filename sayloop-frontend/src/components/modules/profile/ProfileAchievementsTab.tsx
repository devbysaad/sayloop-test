import React from 'react';

interface Achievement {
  icon: string;
  title: string;
  desc: string;
  done: boolean;
}

interface Props {
  achievements: Achievement[];
}

const ProfileAchievementsTab = ({ achievements }: Props) => (
  <div className="flex flex-col gap-2.5">
    {achievements.map(a => (
      <div
        key={a.title}
        className={`group bg-white border-2 rounded-[16px] px-4 py-3.5 shadow-sm flex items-center gap-3 transition-all hover:translate-x-1
          ${a.done ? 'border-amber-300' : 'border-gray-200 opacity-50 grayscale-[0.4]'}`}
      >
        <div className={`w-11 h-11 rounded-[13px] flex items-center justify-center text-[20px] shrink-0 border-2 transition-transform group-hover:scale-110
          ${a.done ? 'bg-amber-50 border-amber-200' : 'bg-gray-100 border-gray-200'}`}>
          {a.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-[13px] m-0 mb-px">{a.title}</p>
          <p className="font-semibold text-gray-400 text-[11px] m-0 leading-tight">{a.desc}</p>
        </div>
        <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] text-white shrink-0 font-bold
          ${a.done ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm' : 'bg-gray-200'}`}>
          {a.done ? '✓' : '🔒'}
        </div>
      </div>
    ))}
  </div>
);

export default ProfileAchievementsTab;