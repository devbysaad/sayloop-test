import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { home, letter, leaderboard, quests, shop, profile } from '../../../assets/SidebarAssets/index';

const Header = () => {
  const location = useLocation();
  const navItems = [
    { icon: home,        label: 'Home',    path: '/home' },
    { icon: letter,      label: 'Learn',   path: '/learn' },
    { icon: quests,      label: 'Quests',  path: '/quests' },
    { icon: leaderboard, label: 'Board',   path: '/leaderboard' },
    { icon: shop,        label: 'Shop',    path: '/shop' },
    { icon: profile,     label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="lg:hidden" style={{
      fontFamily: "'Nunito', sans-serif",
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: '64px', zIndex: 100,
      background: '#fffbf5', borderTop: '2px solid #fef3c7',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 4px',
    }}>
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} style={{ textDecoration: 'none', flex: 1 }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '52px', borderRadius: '12px', margin: '0 2px',
              background: active ? '#fef3c7' : 'transparent',
              border: active ? '2px solid #fcd34d' : '2px solid transparent',
            }}>
              <img src={item.icon} alt={item.label} style={{ width: '22px', height: '22px', marginBottom: '2px', opacity: active ? 1 : 0.45 }} />
              <span style={{ fontSize: '9px', fontWeight: 800, color: active ? '#1a1a26' : '#9ca3af' }}>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default Header;