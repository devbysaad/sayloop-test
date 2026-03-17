import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sayloopLogo } from '../../../assets/logo';
import { home, letter, leaderboard, quests, shop, profile, more } from '../../../assets/SidebarAssets/index';

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: home,        label: 'HOME',         path: '/home' },
    { icon: letter,      label: 'LEARN',        path: '/learn' },
    { icon: leaderboard, label: 'LEADERBOARDS', path: '/leaderboard' },
    { icon: quests,      label: 'QUESTS',       path: '/quests' },
    { icon: shop,        label: 'SHOP',         path: '/shop' },
    { icon: profile,     label: 'PROFILE',      path: '/profile' },
    { icon: more,        label: 'MORE',         path: '/more' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-72 z-40 bg-[#fffbf5] border-r-2 border-orange-100 flex flex-col p-5 overflow-y-auto"
      style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Logo */}
      <Link to="/" className="px-2 mb-4 block">
        <img src={sayloopLogo} alt="SayLoop" className="w-[150px]" />
      </Link>

      {/* XP + streak chips */}
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1 text-xs font-black text-yellow-600">
          ⚡ 565 XP
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 text-xs font-black text-orange-500">
          🔥 18 streak
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1">
        <ul className="list-none m-0 p-0 flex flex-col gap-[3px]">
          {menuItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link to={item.path} className="group no-underline">
                  <div className={`flex items-center gap-3.5 px-4 py-[11px] rounded-2xl text-[13px] tracking-widest font-black transition-all duration-150 border-2
                    ${active
                      ? 'border-orange-300 text-[#FF6B35]'
                      : 'bg-transparent border-transparent text-gray-400 group-hover:bg-orange-50 group-hover:translate-x-1 group-hover:border-orange-100 group-hover:text-orange-400'
                    }`}
                    style={active ? { background: 'linear-gradient(135deg,#fff7ed,#ffedd5)' } : {}}
                  >
                    <img src={item.icon} alt={item.label} className={`w-6 h-6 ${active ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`} />
                    <span>{item.label}</span>
                    {active && <span className="ml-auto w-2 h-2 rounded-full bg-[#FF6B35]" />}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Pro promo */}
      <div className="mt-5 rounded-[20px] p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1A1A26,#2d2d3d)' }}>
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#FFC857,transparent 70%)' }} />
        <p className="text-[#FFC857] text-[10px] font-black m-0 mb-1 tracking-[1.5px] uppercase">SayLoop Pro</p>
        <p className="text-white text-[13px] font-black m-0 mb-3 leading-snug">Unlimited conversations & no ads</p>
        <button
          className="w-full text-white font-black text-[12px] py-2.5 rounded-xl border-none cursor-pointer shadow-lg hover:scale-105 transition-transform active:scale-95"
          style={{ background: 'linear-gradient(135deg,#FF6B35,#FFC857)', boxShadow: '0 6px 18px rgba(255,107,53,0.4)' }}
        >
          Try free for 7 days 🚀
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;