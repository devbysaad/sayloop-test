import React from 'react';

export type Tab = 'stats' | 'achievements' | 'settings';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'stats',        label: 'Stats',        icon: '📊' },
  { key: 'achievements', label: 'Achievements', icon: '🏆' },
  { key: 'settings',     label: 'Settings',     icon: '⚙️' },
];

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const ProfileTabs = ({ active, onChange }: Props) => (
  <div className="flex gap-1.5 mb-3.5 bg-white border-2 border-amber-100 rounded-[16px] p-1.5">
    {TABS.map(t => (
      <button
        key={t.key}
        onClick={() => onChange(t.key)}
        className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-2.5 rounded-[11px] text-[12px] font-extrabold transition-all border-none cursor-pointer
          ${active === t.key
            ? 'bg-amber-100 text-gray-900 shadow-sm'
            : 'bg-transparent text-gray-400 hover:bg-gray-50'}`}
      >
        {t.icon} {t.label}
      </button>
    ))}
  </div>
);

export default ProfileTabs;