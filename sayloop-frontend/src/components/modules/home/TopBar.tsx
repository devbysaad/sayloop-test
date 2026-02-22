import React from 'react';
import { heart, points, start, usaflag } from '../../../assets/RightsidebarAssets';

const TopBar = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        :root { --topbar-h: 52px; --header-h: 64px; }
      `}</style>
      <div className="lg:hidden" style={{
        fontFamily: "'Nunito', sans-serif",
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '52px', zIndex: 100,
        background: '#fffbf5', borderBottom: '2px solid #fef3c7',
        padding: '0 16px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <img src={usaflag} alt="lang" style={{ width: '30px', height: '30px', borderRadius: '8px', border: '2px solid #fcd34d' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ src: start, val: '0', color: '#f97316' }, { src: points, val: '565', color: '#3b82f6' }, { src: heart, val: '5', color: '#ef4444' }].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', border: '2px solid #fef3c7', borderRadius: '10px', padding: '4px 8px' }}>
              <img src={s.src} alt="" style={{ width: '16px', height: '16px' }} />
              <span style={{ color: s.color, fontWeight: 900, fontSize: '12px' }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TopBar;