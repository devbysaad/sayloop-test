import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { chest, heart, lingobird, lock, points, start, usaflag } from '../../../assets/RightsidebarAssets';

const RightSidebar = () => {
  return (
    <aside className="hidden lg:flex fixed top-0 right-0 bottom-0 w-[300px] z-40 bg-[#fffbf5] border-l-2 border-orange-100 flex-col p-4 pt-5 overflow-y-auto gap-3.5"
      style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Stats + user row */}
      <div className="bg-white border-2 border-orange-100 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm hover:-translate-y-0.5 transition-transform">
        <div className="flex gap-3 items-center">
          {[
            { src: start,  val: '18',  color: 'text-[#FF6B35]' },
            { src: points, val: '565', color: 'text-[#FFC857]' },
            { src: heart,  val: '5',   color: 'text-red-400' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <img src={s.src} alt="" className="w-5 h-5" />
              <span className={`${s.color} font-black text-[14px]`}>{s.val}</span>
            </div>
          ))}
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Pro card */}
      <div className="rounded-2xl p-5 relative overflow-hidden hover:-translate-y-0.5 transition-transform shadow-lg"
        style={{ background: 'linear-gradient(135deg,#1A1A26,#2d2d3d)' }}>
        <div className="absolute -top-8 -right-5 w-[130px] h-[130px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#FFC857,transparent 70%)' }} />
        <span className="text-white text-[10px] font-black px-3 py-1 rounded-b-lg absolute top-0 left-4 tracking-wider uppercase"
          style={{ background: 'linear-gradient(135deg,#FF6B35,#FFC857)' }}>Pro</span>
        <div className="absolute right-0 top-0 opacity-60">
          <img src={lingobird} alt="" className="w-[65px]" />
        </div>
        <div className="mt-6">
          <h3 className="text-white font-black text-[15px] mb-1.5">Try SayLoop Pro</h3>
          <p className="text-gray-400 text-[12px] font-semibold mb-3.5 leading-relaxed">Unlimited conversations, no ads, priority matching.</p>
          <button
            className="w-full text-white font-black text-[12px] py-2.5 rounded-xl border-none cursor-pointer hover:scale-105 transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg,#FF6B35,#FFC857)', boxShadow: '0 6px 18px rgba(255,107,53,0.35)' }}
          >
            TRY 1 WEEK FREE 🚀
          </button>
        </div>
      </div>

      {/* Unlock Leaderboards */}
      <div className="bg-white border-2 border-orange-100 rounded-2xl p-4 hover:-translate-y-0.5 transition-transform shadow-sm">
        <h3 className="text-gray-800 font-black text-[13px] mb-2.5">🏆 Unlock Leaderboards!</h3>
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-2.5 shrink-0">
            <img src={lock} alt="lock" className="w-6 h-6" />
          </div>
          <p className="text-gray-500 text-[12px] font-semibold m-0 leading-relaxed">
            Complete <span className="font-black text-gray-800">9 more lessons</span> to start competing
          </p>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="bg-white border-2 border-orange-100 rounded-2xl p-4 hover:-translate-y-0.5 transition-transform shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-800 font-black text-[13px] m-0">🎯 Daily Quests</h3>
          <button className="text-[#FF6B35] text-[11px] font-black bg-transparent border-none cursor-pointer hover:underline">VIEW ALL</button>
        </div>
        {/* Quest progress */}
        <div className="space-y-2.5">
          {[
            { label: 'Earn 10 XP', done: 0, total: 10 },
            { label: 'Have 1 conversation', done: 0, total: 1 },
          ].map(q => (
            <div key={q.label} className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <img src={points} alt="XP" className="w-4 h-4" />
                  <span className="text-gray-800 font-black text-[12px]">{q.label}</span>
                </div>
                <span className="text-gray-400 text-[11px] font-bold">{q.done}/{q.total}</span>
              </div>
              <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(q.done/q.total)*100}%`, background: 'linear-gradient(135deg,#FF6B35,#FFC857)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white border-2 border-orange-100 rounded-2xl p-4 hover:-translate-y-0.5 transition-transform shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {['Discover more', '🇺🇸 SayLoop ABC', '🎵 SayLoop', '📖 Learn to Read', '💬 sayloop'].map((tag, i) => (
            <span key={tag} className={`bg-white text-gray-700 text-[11px] font-bold px-2.5 py-1.5 rounded-full border-2 cursor-pointer transition-colors
              ${i === 1 ? 'border-orange-300 hover:bg-orange-50 text-[#FF6B35]' : 'border-gray-200 hover:bg-gray-50'}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t-2 border-orange-50 pt-3.5 mt-auto">
        <div className="flex flex-wrap justify-center gap-x-3.5 gap-y-1.5">
          {['ABOUT', 'BLOG', 'CAREERS', 'TERMS', 'PRIVACY'].map(l => (
            <a key={l} href="#" className="text-gray-400 text-[10px] font-bold no-underline hover:text-[#FF6B35] transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;