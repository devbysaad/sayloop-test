import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { home, letter, leaderboard, quests, shop, profile, more } from '../../../assets/SidebarAssets/index';

const Sidebar = () => {
  const location = useLocation();
  const { xp, streak } = useSelector((s: RootState) => s.economy);
  const { pendingRequestCount } = useSelector((s: RootState) => s.match);
  const menuItems = [
    { icon: home, label: 'HOME', path: '/home' },
    { icon: letter, label: 'LEARN', path: '/learn' },
    { icon: leaderboard, label: 'LEADERBOARDS', path: '/leaderboard' },
    { icon: quests, label: 'QUESTS', path: '/quests' },
    { icon: shop, label: 'SHOP', path: '/shop' },
    { icon: profile, label: 'PROFILE', path: '/profile' },
    { icon: more, label: 'MORE', path: '/more' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-72 z-40 flex flex-col p-5 overflow-y-auto"
      style={{ background: '#F8F5EF', borderRight: '1px solid rgba(20,20,20,0.08)', fontFamily: "'Outfit', sans-serif" }}>

      <Link to="/" className="px-2 mb-4 block">
        <img src="/logo.png" alt="SayLoop" className="w-[150px]" />
      </Link>

      {/* XP + streak chips */}
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black"
          style={{ background: '#FEF8EF', border: '1px solid rgba(180,83,9,0.2)', color: '#B45309' }}>
          ⚡ {xp} XP
        </div>
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black"
          style={{ background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.2)', color: '#E8480C' }}>
          🔥 {streak} streak
        </div>
      </div>

      <nav className="flex-1">
        <ul className="list-none m-0 p-0 flex flex-col gap-[3px]">
          {menuItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link to={item.path} className="group no-underline">
                  <div
                    className="flex items-center gap-3.5 px-4 py-[11px] rounded-xl text-[13px] tracking-widest font-black transition-all duration-150 border"
                    style={{
                      background: active ? '#FFF4EF' : 'transparent',
                      borderColor: active ? 'rgba(232,72,12,0.25)' : 'transparent',
                      color: active ? '#E8480C' : 'rgba(20,20,20,0.4)',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(232,72,12,0.05)'; e.currentTarget.style.color = '#E8480C'; e.currentTarget.style.transform = 'translateX(4px)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(20,20,20,0.4)'; e.currentTarget.style.transform = 'translateX(0)'; } }}
                  >
                    <div className="relative">
                      <img src={item.icon} alt={item.label} className="w-6 h-6" style={{ opacity: active ? 1 : 0.35 }} />
                      {item.path === '/home' && pendingRequestCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                    <span>{item.label}</span>
                    {active && <span className="ml-auto w-2 h-2 rounded-full" style={{ background: '#E8480C' }} />}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Pro promo */}
      <div className="mt-5 rounded-xl p-5 relative overflow-hidden"
        style={{ background: '#141414' }}>
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#E8480C,transparent 70%)' }} />
        <p className="text-[10px] font-black m-0 mb-1 tracking-[1.5px] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>SayLoop Pro</p>
        <p className="text-white text-[13px] font-black m-0 mb-3 leading-snug" style={{ letterSpacing: '-0.2px' }}>Unlimited conversations & no ads</p>
        <button
          className="w-full text-white font-black text-[12px] py-2.5 rounded-xl border-none cursor-pointer hover:scale-105 transition-transform active:scale-95"
          style={{ background: '#E8480C', boxShadow: '0 6px 18px rgba(232,72,12,0.35)' }}>
          Try free for 7 days →
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;