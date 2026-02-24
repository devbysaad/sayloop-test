import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sayloopLogo } from '../../../assets/logo';
import { home, letter, leaderboard, quests, shop, profile, more } from '../../../assets/SidebarAssets/index';

const Sidebar = () => {
  const location = useLocation();
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
    <aside className="fixed inset-y-0 left-0 w-72 z-40 bg-[#fffbf5] border-r-2 border-[#fef3c7] flex flex-col p-5 overflow-y-auto font-sans">
      {/* Logo */}
      <Link to="/" className="px-2 mb-7">
        <img src={sayloopLogo} alt="Sayloop" className="w-[150px]" />
      </Link>

      {/* Nav */}
      <nav className="flex-1">
        <ul className="list-none m-0 p-0 flex flex-col gap-[3px]">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link to={item.path} className="group no-underline">
                  <div className={`flex items-center gap-3.5 px-4 py-[11px] rounded-[14px] text-[13px] tracking-widest font-[800] transition-all duration-150 group-hover:bg-[#fef9f0] group-hover:translate-x-[3px] border-2 ${active ? 'bg-[#fef3c7] border-[#fcd34d] text-[#1a1a26]' : 'bg-transparent border-transparent text-[#9ca3af]'
                    }`}>
                    <img src={item.icon} alt={item.label} className={`w-6 h-6 ${active ? 'opacity-100' : 'opacity-50'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Pro promo */}
      <div className="mt-5 bg-[#1a1a26] rounded-[18px] p-4 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[radial-gradient(circle,#fde68a,transparent_65%)] opacity-25" />
        <p className="text-[#f59e0b] text-[10px] font-[900] m-0 mb-1 tracking-[1.5px] uppercase">Sayloop Pro</p>
        <p className="text-[#fffbf5] text-[13px] font-[800] m-0 mb-3 leading-relaxed">Unlimited conversations & no ads</p>
        <button className="w-full bg-linear-to-br from-[#fbbf24] to-[#f97316] text-white font-[800] text-[12px] py-[9px] rounded-[11px] border-none cursor-pointer font-sans shadow-md hover:shadow-lg transition-all active:scale-95">
          Try free for 7 days
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;