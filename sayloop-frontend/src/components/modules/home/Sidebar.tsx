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
    <>
      <style>{`
        .sidebar-link { transition: background .15s, transform .12s; text-decoration: none; }
        .sidebar-link:hover > div { background: #fef9f0 !important; transform: translateX(3px); }
      `}</style>
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: '288px', zIndex: 40,
        background: '#fffbf5', borderRight: '2px solid #fef3c7',
        display: 'flex', flexDirection: 'column',
        padding: '20px 12px', overflowY: 'auto',
        fontFamily: "'Nunito', sans-serif",
      }}>
        {/* Logo */}
        <div style={{ padding: '0 8px', marginBottom: '28px' }}>
          <img src={sayloopLogo} alt="Sayloop" style={{ width: '150px' }} />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {menuItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link to={item.path} className="sidebar-link">
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '11px 16px', borderRadius: '14px',
                      fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px',
                      background: active ? '#fef3c7' : 'transparent',
                      border: active ? '2px solid #fcd34d' : '2px solid transparent',
                      color: active ? '#1a1a26' : '#9ca3af',
                      transition: 'background .15s, transform .12s',
                    }}>
                      <img src={item.icon} alt={item.label} style={{ width: '24px', height: '24px', opacity: active ? 1 : 0.5 }} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pro promo */}
        <div style={{ marginTop: '20px', background: '#1a1a26', borderRadius: '18px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-24px', right: '-24px', width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle,#fde68a,transparent 65%)', opacity: 0.25 }} />
          <p style={{ color: '#f59e0b', fontSize: '10px', fontWeight: 900, margin: '0 0 4px', letterSpacing: '1.5px' }}>SAYLOOP PRO</p>
          <p style={{ color: '#fffbf5', fontSize: '13px', fontWeight: 800, margin: '0 0 12px', lineHeight: 1.4 }}>Unlimited conversations & no ads</p>
          <button style={{ width: '100%', background: 'linear-gradient(135deg,#fbbf24,#f97316)', color: '#fff', fontWeight: 800, fontSize: '12px', padding: '9px', borderRadius: '11px', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
            Try free for 7 days
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;