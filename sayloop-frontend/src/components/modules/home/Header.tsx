import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { home, letter, leaderboard, quests, shop, profile } from '../../../assets/SidebarAssets/index';

const Header = () => {
  const location = useLocation();
  const { pendingRequestCount } = useSelector((s: RootState) => s.match);
  const navItems = [
    { icon: home, label: 'Home', path: '/home' },
    { icon: letter, label: 'Learn', path: '/learn' },
    { icon: quests, label: 'Quests', path: '/quests' },
    { icon: leaderboard, label: 'Board', path: '/leaderboard' },
    { icon: shop, label: 'Shop', path: '/shop' },
    { icon: profile, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="lg:hidden" style={{
      fontFamily: "'Outfit', sans-serif",
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: '64px', zIndex: 100,
      background: '#F8F5EF',
      borderTop: '1px solid rgba(20,20,20,0.08)',
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
              background: active ? '#FFF4EF' : 'transparent',
              border: active ? '1px solid rgba(232,72,12,0.25)' : '1px solid transparent',
              transition: 'all 0.15s',
            }}>
              <div className="relative">
                <img src={item.icon} alt={item.label}
                  style={{ width: '22px', height: '22px', marginBottom: '2px', opacity: active ? 1 : 0.35 }} />
                {item.path === '/home' && pendingRequestCount > 0 && (
                  <span className="absolute -top-0.5 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '9px', fontWeight: 800,
                color: active ? '#E8480C' : 'rgba(20,20,20,0.4)',
              }}>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default Header;