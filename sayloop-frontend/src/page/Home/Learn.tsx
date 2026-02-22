import React from 'react';
import PageShell from '../../components/modules/home/PageShell';

const Learn = () => {
  return (
    <PageShell>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .anim-1 { animation: fadeUp .45s ease both; }
        .anim-2 { animation: fadeUp .45s .1s ease both; }
        .lesson-node { transition: transform .18s, box-shadow .18s; cursor: pointer; }
        .lesson-node:hover { transform: scale(1.07); }
        .bob { animation: bob 2.2s ease-in-out infinite; }
      `}</style>

      {/* Section header */}
      <div className="anim-1" style={{ background: 'linear-gradient(135deg,#1a1a26,#2d2d3d)', borderRadius: '22px', padding: '20px 24px', marginBottom: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-24px', right: '-24px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle,#fde68a,transparent 65%)', opacity: 0.2, pointerEvents: 'none' }} />
        <div>
          <p style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '1px' }}>← SECTION 1, UNIT 1</p>
          <h1 style={{ color: '#fffbf5', fontSize: 'clamp(15px,3vw,18px)', fontWeight: 900, margin: 0, lineHeight: 1.3 }}>Solo trip: Compare travel experiences</h1>
        </div>
        <button style={{ background: '#fff', color: '#1a1a26', padding: '10px 16px', borderRadius: '12px', fontWeight: 800, fontSize: '12px', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
          ≡ GUIDEBOOK
        </button>
      </div>

      {/* Learning path */}
      <div className="anim-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '40px' }}>

        {/* Node 1 — START (active, bouncing) */}
        <div className="lesson-node bob" style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'linear-gradient(135deg,#fbbf24,#f97316)', border: '4px solid #d97706', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 28px rgba(251,191,36,0.45)' }}>
          <span style={{ color: '#fff', fontSize: '30px', lineHeight: 1 }}>✓</span>
          <span style={{ color: '#fff', fontSize: '10px', fontWeight: 900 }}>START</span>
        </div>

        <div style={{ width: '3px', height: '28px', background: 'linear-gradient(#fcd34d,#fef3c7)' }} />

        {/* Node 2 — Star (done) */}
        <div className="lesson-node" style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg,#fbbf24,#f97316)', border: '4px solid #d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(251,191,36,0.3)' }}>
          <span style={{ fontSize: '28px' }}>⭐</span>
        </div>

        <div style={{ width: '3px', height: '28px', background: '#e5e7eb' }} />

        {/* Node 3 — Chest (locked, wide) */}
        <div className="lesson-node" style={{ width: '110px', height: '78px', borderRadius: '18px', background: '#fff', border: '3px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
          <span style={{ fontSize: '36px' }}>📦</span>
          <div style={{ position: 'absolute', top: '-9px', right: '-9px', width: '24px', height: '24px', background: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>🔒</div>
        </div>

        <div style={{ width: '3px', height: '28px', background: '#e5e7eb' }} />

        {/* Node 4 — Mascot (big, next unlock) */}
        <div className="lesson-node" style={{ position: 'relative' }}>
          <div style={{ width: '116px', height: '116px', borderRadius: '50%', background: '#fef9f0', border: '4px solid #fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(251,191,36,0.18)' }}>
            <span style={{ fontSize: '52px' }}>💬</span>
          </div>
          {/* Tooltip */}
          <div style={{ position: 'absolute', bottom: '-44px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a26', borderRadius: '10px', padding: '5px 12px', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 800 }}>Talk to practice!</span>
            <div style={{ position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid #1a1a26' }} />
          </div>
        </div>

        <div style={{ width: '3px', height: '44px', background: '#e5e7eb' }} />

        {/* Node 5 — Puzzle (locked) */}
        <div className="lesson-node" style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#fff', border: '3px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '26px' }}>🧩</span>
          <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', background: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>🔒</div>
        </div>

        <div style={{ width: '3px', height: '28px', background: '#e5e7eb' }} />

        {/* Node 6 — Trophy (locked) */}
        <div className="lesson-node" style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#fff', border: '3px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '26px' }}>🏆</span>
          <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', background: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>🔒</div>
        </div>

      </div>

      {/* Bottom label */}
      <div style={{ textAlign: 'center', borderTop: '2px solid #fef3c7', paddingTop: '20px' }}>
        <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 700, margin: 0 }}>Solo trip: Ask about transportation</p>
      </div>
    </PageShell>
  );
};

export default Learn;