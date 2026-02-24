import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { chest, heart, lingobird, lock, points, start, usaflag } from '../../../assets/RightsidebarAssets';

const RightSidebar = () => {
  return (
    <aside className="hidden lg:flex fixed top-0 right-0 bottom-0 w-[300px] z-40 bg-[#fffbf5] border-l-2 border-[#fef3c7] flex-col p-4 pt-5 overflow-y-auto font-sans gap-3.5">
      {/* Stats + user */}
      <div className="bg-white border-2 border-[#fef3c7] rounded-[18px] px-4 py-3 flex items-center justify-between transition-transform duration-150 hover:-translate-y-0.5 shadow-sm">
        <div className="flex gap-3">
          {[{ src: start, val: '0', color: 'text-[#f97316]' }, { src: points, val: '565', color: 'text-[#3b82f6]' }, { src: heart, val: '5', color: 'text-[#ef4444]' }].map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <img src={s.src} alt="" className="w-5 h-5" />
              <span className={`${s.color} font-[900] text-[14px]`}>{s.val}</span>
            </div>
          ))}
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Pro card */}
      <div className="group bg-[#1a1a26] rounded-[20px] p-5 relative overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 shadow-lg">
        <div className="absolute -top-[30px] -right-[20px] w-[120px] h-[120px] rounded-full bg-[radial-gradient(circle,#fde68a,transparent_65%)] opacity-20" />
        <span className="bg-linear-to-br from-[#fbbf24] to-[#f97316] text-white text-[10px] font-[900] px-[10px] py-[3px] rounded-b-lg absolute top-0 left-4 tracking-[1px] uppercase">Pro</span>
        <div className="absolute right-0 top-0">
          <img src={lingobird} alt="" className="w-[65px] h-[65px] opacity-70" />
        </div>
        <div className="mt-6">
          <h3 className="text-[#fffbf5] font-[900] text-[15px] mb-1.5">Try Sayloop Pro</h3>
          <p className="text-[#9ca3af] text-[12px] font-[600] mb-3.5 leading-relaxed">Unlimited conversations, no ads, priority matching.</p>
          <button className="w-full bg-linear-to-br from-[#fbbf24] to-[#f97316] text-white font-[800] text-[12px] py-2.5 rounded-[12px] border-none cursor-pointer font-sans shadow-[0_6px_18px_rgba(251,191,36,0.35)] hover:shadow-xl transition-all active:scale-95">
            TRY 1 WEEK FREE
          </button>
        </div>
      </div>

      {/* Unlock Leaderboards */}
      <div className="bg-white border-2 border-[#fef3c7] rounded-[18px] p-4 transition-transform duration-150 hover:-translate-y-0.5 shadow-sm">
        <h3 className="text-[#1a1a26] font-[900] text-[13px] mb-2.5">Unlock Leaderboards!</h3>
        <div className="flex items-center gap-3">
          <div className="bg-[#fef9f0] border-2 border-[#fde68a] rounded-[12px] p-2.5 shrink-0">
            <img src={lock} alt="lock" className="w-6 h-6" />
          </div>
          <p className="text-[#6b7280] text-[12px] font-[600] m-0 leading-relaxed">
            Complete <span className="font-[900] text-[#1a1a26]">9 more lessons</span> to start competing
          </p>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="bg-white border-2 border-[#fef3c7] rounded-[18px] p-4 transition-transform duration-150 hover:-translate-y-0.5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#1a1a26] font-[900] text-[13px] m-0">Daily Quests</h3>
          <button className="text-[#f59e0b] text-[11px] font-[800] bg-transparent border-none cursor-pointer font-sans hover:underline">VIEW ALL</button>
        </div>
        <div className="flex items-center justify-between bg-[#fef9f0] border-2 border-[#fef3c7] rounded-[12px] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <img src={points} alt="XP" className="w-6 h-6" />
            <span className="text-[#1a1a26] font-[800] text-[13px]">Earn 10 XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#9ca3af] text-[12px] font-[700]">0 / 10</span>
            <img src={chest} alt="chest" className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white border-2 border-[#fef3c7] rounded-[18px] p-4 transition-transform duration-150 hover:-translate-y-0.5 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {['Discover more', '🇺🇸 Sayloop ABC', '🎵 Sayloop', '📖 Learn to Read', '💬 sayloop'].map((tag, i) => (
            <span key={tag} className={`bg-white text-[#374151] text-[11px] font-[700] px-2.5 py-1.5 rounded-full border-2 cursor-pointer transition-colors ${i === 1 ? 'border-[#f59e0b] hover:bg-amber-50' : 'border-[#e5e7eb] hover:bg-gray-50'
              }`}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t-2 border-[#fef3c7] pt-3.5 mt-auto">
        <div className="flex flex-wrap justify-center gap-x-3.5 gap-y-1.5">
          {['ABOUT', 'BLOG', 'CAREERS', 'TERMS', 'PRIVACY'].map(l => (
            <a key={l} href="#" className="text-[#9ca3af] text-[10px] font-bold no-underline hover:text-gray-600 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;