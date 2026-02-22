import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import PageShell from '../../components/modules/home/PageShell';

const HomePage = () => {
  const { user } = useUser();
  const firstName = user?.firstName || 'there';

  return (
    <PageShell>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .anim-1 { animation: fadeUp .45s ease both; }
        .anim-2 { animation: fadeUp .45s .07s ease both; }
        .anim-3 { animation: fadeUp .45s .14s ease both; }
        .anim-4 { animation: fadeUp .45s .21s ease both; }
        .anim-5 { animation: fadeUp .45s .28s ease both; }
        .hcard { transition: transform .18s, box-shadow .18s; cursor: pointer; }
        .hcard:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.1) !important; }
        .find-btn { transition: transform .18s, box-shadow .18s; }
        .find-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(251,191,36,0.55) !important; }
      `}</style>

      {/* Greeting */}
      <div className="anim-1" style={{ marginBottom: '28px' }}>
        <p style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 700, margin: '0 0 2px' }}>Good day 👋</p>
        <h1 style={{ fontSize: 'clamp(24px,5vw,32px)', fontWeight: 900, color: '#1a1a26', margin: 0 }}>
          Hey, {firstName}!
        </h1>
      </div>

      {/* ── FIND PARTNER hero card ── */}
      <div className="anim-2 hcard" style={{
        background: 'linear-gradient(135deg,#1a1a26,#2d2d3d)',
        borderRadius: '24px', padding: '28px',
        marginBottom: '16px', position: 'relative', overflow: 'hidden',
        border: '2px solid #2d2d3d',
        boxShadow: '0 8px 32px rgba(26,26,38,0.12)',
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle,#fde68a,transparent 65%)', opacity: 0.18, pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '999px', padding: '4px 12px', marginBottom: '12px' }}>
          <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 800 }}>🎙️ LIVE CONVERSATIONS</span>
        </div>

        <h2 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 900, color: '#fffbf5', margin: '0 0 8px', lineHeight: 1.25 }}>
          Find a conversation<br />
          <span style={{ color: '#f59e0b' }}>partner now</span>
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 600, margin: '0 0 20px', maxWidth: '340px', lineHeight: 1.6 }}>
          Get matched with a real native speaker in seconds. Pick a topic and start talking.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
          {[{ e: '🟢', v: '340', l: 'online' }, { e: '⚡', v: '18s', l: 'match' }, { e: '😊', v: '94%', l: 'rating' }].map(s => (
            <div key={s.l} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '12px' }}>{s.e}</span>
              <span style={{ color: '#fffbf5', fontWeight: 900, fontSize: '13px' }}>{s.v}</span>
              <span style={{ color: '#6b7280', fontWeight: 600, fontSize: '11px' }}>{s.l}</span>
            </div>
          ))}
        </div>

        <Link to="/debate">
          <button className="find-btn" style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)', color: '#fff', fontWeight: 800, fontSize: '14px', padding: '12px 28px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 8px 22px rgba(251,191,36,0.4)' }}>
            Find Partner 🚀
          </button>
        </Link>
      </div>

      {/* ── Grid row 1 ── */}
      <div className="anim-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <Link to="/learn" style={{ textDecoration: 'none' }}>
          <div className="hcard" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', height: '100%' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef9f0', border: '2px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>📚</div>
            <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '14px', margin: '0 0 4px' }}>Daily Lessons</p>
            <p style={{ fontWeight: 600, color: '#9ca3af', fontSize: '12px', margin: '0 0 12px', lineHeight: 1.4 }}>Practice vocab & grammar</p>
            <div style={{ background: '#f3f4f6', borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
              <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg,#fbbf24,#f97316)', borderRadius: '999px' }} />
            </div>
            <p style={{ fontWeight: 700, color: '#9ca3af', fontSize: '10px', margin: '4px 0 0' }}>35% complete</p>
          </div>
        </Link>

        <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
          <div className="hcard" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', height: '100%' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef9f0', border: '2px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>🏆</div>
            <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '14px', margin: '0 0 4px' }}>Leaderboard</p>
            <p style={{ fontWeight: 600, color: '#9ca3af', fontSize: '12px', margin: '0 0 12px', lineHeight: 1.4 }}>See your global rank</p>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              {['#fbbf24', '#9ca3af', '#f97316'].map((c, i) => (
                <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 900 }}>{i + 1}</div>
              ))}
              <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, marginLeft: '3px' }}>You're #42</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Grid row 2 ── */}
      <div className="anim-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div className="hcard" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef9f0', border: '2px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>🎯</div>
          <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '14px', margin: '0 0 4px' }}>Daily Quests</p>
          <p style={{ fontWeight: 600, color: '#9ca3af', fontSize: '12px', margin: '0 0 12px' }}>2 of 3 done today</p>
          <div style={{ display: 'flex', gap: '5px' }}>
            {[1, 2, 3].map(i => <div key={i} style={{ flex: 1, height: '5px', borderRadius: '999px', background: i <= 2 ? 'linear-gradient(90deg,#fbbf24,#f97316)' : '#f3f4f6' }} />)}
          </div>
        </div>

        <div className="hcard" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef9f0', border: '2px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>⚡</div>
          <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '14px', margin: '0 0 4px' }}>Your XP</p>
          <p style={{ fontWeight: 600, color: '#9ca3af', fontSize: '12px', margin: '0 0 8px' }}>Keep your streak alive!</p>
          <p style={{ fontWeight: 900, color: '#f59e0b', fontSize: '22px', margin: 0 }}>565 <span style={{ fontWeight: 600, color: '#9ca3af', fontSize: '12px' }}>XP</span></p>
        </div>
      </div>

      {/* ── Recent conversations ── */}
      <div className="anim-5" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '14px', margin: 0 }}>Recent Conversations</p>
          <Link to="/debate" style={{ color: '#f59e0b', fontWeight: 800, fontSize: '12px', textDecoration: 'none' }}>Find new →</Link>
        </div>

        {[
          { name: 'Ahmed', flag: '🇸🇦', topic: 'Daily Life', xp: '+15 XP', time: '2h ago', avatar: '😊' },
          { name: 'Yuki', flag: '🇯🇵', topic: 'Travel & Culture', xp: '+30 XP', time: 'Yesterday', avatar: '🌸' },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #f3f4f6' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg,#fbbf24,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{c.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 800, color: '#1a1a26', fontSize: '13px' }}>{c.name} {c.flag}</p>
              <p style={{ margin: 0, fontWeight: 600, color: '#9ca3af', fontSize: '11px' }}>{c.topic}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ margin: 0, fontWeight: 800, color: '#f59e0b', fontSize: '12px' }}>{c.xp}</p>
              <p style={{ margin: 0, fontWeight: 600, color: '#9ca3af', fontSize: '10px' }}>{c.time}</p>
            </div>
          </div>
        ))}

        <div style={{ marginTop: '12px', background: '#fef9f0', border: '1px dashed #fcd34d', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#d97706', fontSize: '12px' }}>🎙️ Start your first real conversation today!</p>
        </div>
      </div>
    </PageShell>
  );
};

export default HomePage;