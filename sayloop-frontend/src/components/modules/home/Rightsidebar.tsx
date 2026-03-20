import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { chest, heart, lingobird, lock, points, start, usaflag } from '../../../assets/RightsidebarAssets';

const RightSidebar = () => {
  const { xp, gems, streak } = useSelector((s: RootState) => s.economy);
  return (
    <aside className="hidden lg:flex fixed top-0 right-0 bottom-0 w-[300px] z-40 flex-col p-4 pt-5 overflow-y-auto gap-3.5"
      style={{ background: '#F8F5EF', borderLeft: '1px solid rgba(20,20,20,0.08)', fontFamily: "'Outfit', sans-serif" }}>

      {/* Stats + user row */}
      <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm hover:-translate-y-0.5 transition-transform"
        style={{ border: '1px solid rgba(20,20,20,0.08)' }}>
        <div className="flex gap-3 items-center">
          {[
          { src: start, val: streak.toString(),  color: '#E8480C' },
            { src: points, val: xp.toString(),  color: '#B45309' },
            { src: heart, val: gems.toString(), color: '#E8480C' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <img src={s.src} alt="" className="w-5 h-5" />
              <span className="font-black text-[14px]" style={{ color: s.color }}>{s.val}</span>
            </div>
          ))}
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Pro card */}
      <div className="rounded-2xl p-5 relative overflow-hidden hover:-translate-y-0.5 transition-transform shadow-sm"
        style={{ background: '#141414' }}>
        <div className="absolute -top-8 -right-5 w-[130px] h-[130px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#E8480C,transparent 70%)' }} />
        <span className="text-white text-[10px] font-black px-3 py-1 rounded-b-lg absolute top-0 left-4 tracking-wider uppercase"
          style={{ background: '#E8480C' }}>Pro</span>
        <div className="absolute right-0 top-0 opacity-50">
          <img src={lingobird} alt="" className="w-[65px]" />
        </div>
        <div className="mt-6">
          <h3 className="text-white font-black text-[15px] mb-1.5" style={{ letterSpacing: '-0.2px' }}>Try SayLoop Pro</h3>
          <p className="text-[12px] font-normal mb-3.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>Unlimited conversations, no ads, priority matching.</p>
          <button
            className="w-full text-white font-black text-[12px] py-2.5 rounded-xl border-none cursor-pointer hover:scale-105 transition-transform active:scale-95"
            style={{ background: '#E8480C', boxShadow: '0 6px 18px rgba(232,72,12,0.35)' }}>
            TRY 1 WEEK FREE →
          </button>
        </div>
      </div>

      {/* Unlock Leaderboards */}
      <div className="bg-white rounded-2xl p-4 hover:-translate-y-0.5 transition-transform shadow-sm"
        style={{ border: '1px solid rgba(20,20,20,0.08)' }}>
        <h3 className="text-[#141414] font-black text-[13px] mb-2.5">🏆 Unlock Leaderboards!</h3>
        <div className="flex items-center gap-3">
          <div className="rounded-xl p-2.5 shrink-0" style={{ background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.2)' }}>
            <img src={lock} alt="lock" className="w-6 h-6" />
          </div>
          <p className="text-[12px] font-normal m-0 leading-relaxed" style={{ color: 'rgba(20,20,20,0.5)' }}>
            Complete <span className="font-black text-[#141414]">9 more lessons</span> to start competing
          </p>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="bg-white rounded-2xl p-4 hover:-translate-y-0.5 transition-transform shadow-sm"
        style={{ border: '1px solid rgba(20,20,20,0.08)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#141414] font-black text-[13px] m-0">🎯 Daily Quests</h3>
          <button className="text-[11px] font-black bg-transparent border-none cursor-pointer hover:underline"
            style={{ color: '#E8480C' }}>VIEW ALL</button>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Earn 10 XP', done: 0, total: 10 },
            { label: 'Have 1 conversation', done: 0, total: 1 },
          ].map(q => (
            <div key={q.label} className="rounded-xl px-3 py-2.5"
              style={{ background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.15)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <img src={points} alt="XP" className="w-4 h-4" />
                  <span className="text-[#141414] font-black text-[12px]">{q.label}</span>
                </div>
                <span className="text-[11px] font-medium" style={{ color: 'rgba(20,20,20,0.4)' }}>{q.done}/{q.total}</span>
              </div>
              <div className="rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(20,20,20,0.07)' }}>
                <div className="h-full rounded-full" style={{ width: `${(q.done / q.total) * 100}%`, background: '#E8480C' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-2xl p-4 hover:-translate-y-0.5 transition-transform shadow-sm"
        style={{ border: '1px solid rgba(20,20,20,0.08)' }}>
        <div className="flex flex-wrap gap-1.5">
          {['Discover more', '🇺🇸 SayLoop ABC', '🎵 SayLoop', '📖 Learn to Read', '💬 sayloop'].map((tag, i) => (
            <span key={tag}
              className="text-[11px] font-medium px-2.5 py-1.5 rounded-full cursor-pointer transition-colors"
              style={{
                background: i === 1 ? '#FFF4EF' : 'white',
                color: i === 1 ? '#E8480C' : 'rgba(20,20,20,0.5)',
                border: i === 1 ? '1px solid rgba(232,72,12,0.2)' : '1px solid rgba(20,20,20,0.1)',
              }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3.5 mt-auto" style={{ borderTop: '1px solid rgba(20,20,20,0.06)' }}>
        <div className="flex flex-wrap justify-center gap-x-3.5 gap-y-1.5">
          {['ABOUT', 'BLOG', 'CAREERS', 'TERMS', 'PRIVACY'].map(l => (
            <a key={l} href="#"
              className="text-[10px] font-medium no-underline transition-colors"
              style={{ color: 'rgba(20,20,20,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8480C')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(20,20,20,0.3)')}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;