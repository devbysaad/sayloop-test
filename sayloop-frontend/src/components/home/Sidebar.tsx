import React from 'react';
import { sayloopLogo } from '../../assets/logo';
import { home, letter, leaderboard, quests, shop, profile, more } from '../../assets/SidebarAssets/index';

type Props = {}

const Sidebar = (props: Props) => {
  const menuItems = [
    { icon: home, label: 'LEARN', active: true },
    { icon: letter, label: 'LETTERS', active: false },
    { icon: leaderboard, label: 'LEADERBOARDS', active: false },
    { icon: quests, label: 'QUESTS', active: false },
    { icon: shop, label: 'SHOP', active: false },
    { icon: profile, label: 'PROFILE', active: false },
    { icon: more, label: 'MORE', active: false },
  ];

  return (
    <aside className="w-72 bg-gray-950 text-white px-2 py-4 min-h-screen">
      {/* Logo */}
      <div className="mb- px-2">
        <img className="w-44" src={sayloopLogo} alt="Sayloop Logo" />
      </div>
      
      {/* Navigation */}
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${
                  item.active
                    ? 'bg-[#2B4356] border-2 border-[#3A5A73] text-white'
                    : 'text-gray-300 hover:bg-[#243340]'
                }`}
              >
                <img src={item.icon} alt={item.label} className="w-7 h-7" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar