import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { chest, heart, lingobird, lock, points, start, usaflag } from '../../../assets/RightsidebarAssets';

const RightSidebar = () => {
  return (
    <>
      <style>{`.rs-card { transition: transform .15s; } .rs-card:hover { transform: translateY(-2px); }`}</style>
      <aside className="hidden lg:flex" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '300px', zIndex: 40,
        background: '#fffbf5', borderLeft: '2px solid #fef3c7',
        flexDirection: 'column', padding: '20px 16px',
        overflowY: 'auto', fontFamily: "'Nunito', sans-serif",
        gap: '14px',
      }}>
        {/* Stats + user */}
        <div className="rs-card" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '18px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[{ src: start, val: '0', color: '#f97316' }, { src: points, val: '565', color: '#3b82f6' }, { src: heart, val: '5', color: '#ef4444' }].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <img src={s.src} alt="" style={{ width: '20px', height: '20px' }} />
                <span style={{ color: s.color, fontWeight: 900, fontSize: '14px' }}>{s.val}</span>
              </div>
            ))}
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Pro card */}
        <div className="rs-card" style={{ background: '#1a1a26', borderRadius: '20px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle,#fde68a,transparent 65%)', opacity: 0.2 }} />
          <span style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '3px 10px', borderRadius: '0 0 8px 8px', position: 'absolute', top: 0, left: '16px', letterSpacing: '1px' }}>PRO</span>
          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            <img src={lingobird} alt="" style={{ width: '65px', height: '65px', opacity: 0.7 }} />
          </div>
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ color: '#fffbf5', fontWeight: 900, fontSize: '15px', margin: '0 0 6px' }}>Try Sayloop Pro</h3>
            <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, margin: '0 0 14px', lineHeight: 1.5 }}>Unlimited conversations, no ads, priority matching.</p>
            <button style={{ width: '100%', background: 'linear-gradient(135deg,#fbbf24,#f97316)', color: '#fff', fontWeight: 800, fontSize: '12px', padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 6px 18px rgba(251,191,36,0.35)' }}>
              TRY 1 WEEK FREE
            </button>
          </div>
        </div>

        {/* Unlock Leaderboards */}
        <div className="rs-card" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '18px', padding: '16px' }}>
          <h3 style={{ color: '#1a1a26', fontWeight: 900, fontSize: '13px', margin: '0 0 10px' }}>Unlock Leaderboards!</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#fef9f0', border: '2px solid #fde68a', borderRadius: '12px', padding: '10px', flexShrink: 0 }}>
              <img src={lock} alt="lock" style={{ width: '24px', height: '24px' }} />
            </div>
            <p style={{ color: '#6b7280', fontSize: '12px', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
              Complete <span style={{ fontWeight: 900, color: '#1a1a26' }}>9 more lessons</span> to start competing
            </p>
          </div>
        </div>

        {/* Daily Quests */}
        <div className="rs-card" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '18px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ color: '#1a1a26', fontWeight: 900, fontSize: '13px', margin: 0 }}>Daily Quests</h3>
            <button style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>VIEW ALL</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fef9f0', border: '2px solid #fef3c7', borderRadius: '12px', padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={points} alt="XP" style={{ width: '24px', height: '24px' }} />
              <span style={{ color: '#1a1a26', fontWeight: 800, fontSize: '13px' }}>Earn 10 XP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 700 }}>0 / 10</span>
              <img src={chest} alt="chest" style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="rs-card" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '18px', padding: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
            {['Discover more', '🇺🇸 Sayloop ABC', '🎵 Sayloop', '📖 Learn to Read', '💬 sayloop'].map((tag, i) => (
              <span key={tag} style={{ background: '#fff', color: '#374151', fontSize: '11px', fontWeight: 700, padding: '5px 10px', borderRadius: '999px', border: `2px solid ${i === 1 ? '#f59e0b' : '#e5e7eb'}`, cursor: 'pointer' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div style={{ borderTop: '2px solid #fef3c7', paddingTop: '14px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 14px' }}>
            {['ABOUT', 'BLOG', 'CAREERS', 'TERMS', 'PRIVACY'].map(l => (
              <a key={l} href="#" style={{ color: '#9ca3af', fontSize: '10px', fontWeight: 700, textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default RightSidebar;