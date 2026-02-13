import React from 'react';
import { home, letter, leaderboard, quests, shop, profile } from '../../../assets/SidebarAssets/index';

type Props = {}

const Header = (props: Props) => {
  const navItems = [
    { icon: home, label: 'Home', color: 'text-yellow-400' },
    { icon: letter, label: 'Letters', color: 'text-blue-400' },
    { icon: quests, label: 'Quests', color: 'text-yellow-400' },
    { icon: leaderboard, label: 'Board', color: 'text-red-400' },
    { icon: shop, label: 'Shop', color: 'text-purple-400' },
    { icon: profile, label: 'Profile', color: 'text-purple-400' },
  ];

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex flex-col items-center justify-center py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors min-w-[60px]"
            >
              <img src={item.icon} alt={item.label} className="w-7 h-7 mb-1" />
              <span className={`text-xs font-semibold ${item.color}`}>
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Header;