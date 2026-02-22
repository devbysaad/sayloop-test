import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import {
  fetchProfileStatsRequest,
} from '../../redux/slice/profile.slice';
import { fetchUserRankRequest } from '../../redux/slice/leaderboard.slice';
import PageShell from '../../components/modules/home/PageShell';

const getLeague = (points: number) => {
  if (points >= 10000) return { name: 'Diamond', color: '#60a5fa', icon: '💎' };
  if (points >= 5000)  return { name: 'Gold',    color: '#f59e0b', icon: '🥇' };
  if (points >= 2000)  return { name: 'Silver',  color: '#9ca3af', icon: '🥈' };
  if (points >= 500)   return { name: 'Bronze',  color: '#f97316', icon: '🥉' };
  return                      { name: 'Rookie',  color: '#a3e635', icon: '🌱' };
};

type Tab = 'stats' | 'achievements' | 'settings';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  // ✅ profile stats from state.profile, user rank from state.leaderboard
  const { profileStats, profileLoading } = useSelector((s: RootState) => s.profile);
  const { userRank } = useSelector((s: RootState) => s.leaderboard);

  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [editingName, setEditingName] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('db_user_id');
    if (id) {
      const uid = parseInt(id);
      dispatch(fetchProfileStatsRequest({ userId: uid }));
      dispatch(fetchUserRankRequest({ userId: uid }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await user?.update({ firstName, lastName });
      setSaveMsg('Saved!');
      setEditingName(false);
      setTimeout(() => setSaveMsg(''), 2500);
    } catch {
      setSaveMsg('Error saving');
    }
    setSaving(false);
  };

  if (!isLoaded) return (
    <PageShell>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #fcd34d', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
        <p style={{ color: '#9ca3af', fontWeight: 700, fontSize: '14px' }}>Loading profile...</p>
      </div>
    </PageShell>
  );

  const points   = profileStats?.points ?? 0;
  const streak   = profileStats?.streakLength ?? userRank?.streakLength ?? 0;
  const rank     = profileStats?.rank ?? userRank?.rank ?? '—';
  const league   = getLeague(points);
  const accuracy = profileStats?.accuracy ?? 0;
  const lessons  = profileStats?.lessonsCompleted ?? 0;

  const statCards = [
    { icon: '🔥', label: 'Day Streak',   value: `${streak}`,              color: '#f97316' },
    { icon: '⚡', label: 'Total XP',     value: points.toLocaleString(),  color: '#f59e0b' },
    { icon: '🏆', label: 'Global Rank',  value: `#${rank}`,               color: '#8b5cf6' },
    { icon: league.icon, label: 'League', value: league.name,             color: league.color },
    { icon: '📚', label: 'Lessons Done', value: `${lessons}`,             color: '#10b981' },
    { icon: '🎯', label: 'Accuracy',     value: `${accuracy}%`,           color: '#3b82f6' },
  ];

  const achievements = [
    { icon: '🎙️', title: 'First Conversation', desc: 'Completed your first live session',   done: true },
    { icon: '🔥', title: '3 Day Streak',        desc: 'Practiced 3 days in a row',            done: streak >= 3 },
    { icon: '⚡', title: 'XP Hunter',           desc: 'Earned 500 XP total',                  done: points >= 500 },
    { icon: '🏆', title: 'Top 50',              desc: 'Reached top 50 on leaderboard',        done: typeof rank === 'number' && rank <= 50 },
    { icon: '📚', title: 'Scholar',             desc: 'Complete 10 lessons',                  done: lessons >= 10 },
    { icon: '🎯', title: 'Sharp Shooter',       desc: 'Achieve 80%+ accuracy',                done: accuracy >= 80 },
  ];

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'stats',        label: 'Stats',        icon: '📊' },
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
    { key: 'settings',     label: 'Settings',     icon: '⚙️' },
  ];

  return (
    <PageShell>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .anim-1 { animation: fadeUp .4s ease both; }
        .anim-2 { animation: fadeUp .4s .07s ease both; }
        .anim-3 { animation: fadeUp .4s .14s ease both; }
        .pcard  { transition: transform .16s, box-shadow .16s; }
        .pcard:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(0,0,0,0.08) !important; }
        .tab-btn { transition:background .13s,color .13s; cursor:pointer; border:none; font-family:'Nunito',sans-serif; }
        .skel { background:linear-gradient(90deg,#f3f4f6 25%,#fef9f0 50%,#f3f4f6 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:14px; }
        .input-field { width:100%; padding:11px 14px; border-radius:12px; border:2px solid #e5e7eb; background:#fff; font-size:14px; font-weight:600; color:#1a1a26; outline:none; font-family:'Nunito',sans-serif; transition:border-color .18s; box-sizing:border-box; }
        .input-field:focus { border-color:#f59e0b; }
      `}</style>

      {/* Hero card */}
      <div className="anim-1" style={{ background: 'linear-gradient(135deg,#1a1a26,#2d2d3d)', borderRadius: '24px', padding: '24px', marginBottom: '14px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle,#fde68a,transparent 65%)', opacity: 0.18 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="avatar" style={{ width: '68px', height: '68px', borderRadius: '20px', border: '3px solid #fcd34d', objectFit: 'cover' }} />
              : <div style={{ width: '68px', height: '68px', borderRadius: '20px', background: 'linear-gradient(135deg,#fbbf24,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 900, color: '#fff', border: '3px solid #fcd34d' }}>
                  {(user?.firstName?.[0] || user?.username?.[0] || '?').toUpperCase()}
                </div>
            }
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '16px', height: '16px', background: '#22c55e', borderRadius: '50%', border: '2.5px solid #1a1a26' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ color: '#fffbf5', fontWeight: 900, fontSize: '19px', margin: '0 0 2px', lineHeight: 1.2 }}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username || 'Learner'}
            </h2>
            <p style={{ color: '#9ca3af', fontWeight: 700, fontSize: '12px', margin: '0 0 6px' }}>@{user?.username || '—'}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '999px', padding: '3px 10px' }}>
              <span>{league.icon}</span>
              <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '11px' }}>{league.name} League</span>
            </div>
          </div>
          <div style={{ background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.25)', borderRadius: '14px', padding: '10px 14px', textAlign: 'center', flexShrink: 0 }}>
            {profileLoading
              ? <div className="skel" style={{ width: '48px', height: '22px', marginBottom: '3px' }} />
              : <p style={{ color: '#f59e0b', fontWeight: 900, fontSize: '22px', margin: '0 0 1px', lineHeight: 1 }}>{points.toLocaleString()}</p>
            }
            <p style={{ color: '#9ca3af', fontWeight: 700, fontSize: '10px', margin: 0 }}>TOTAL XP</p>
          </div>
        </div>
        <p style={{ color: '#4b5563', fontWeight: 600, fontSize: '11px', margin: '14px 0 0' }}>
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
        </p>
      </div>

      {/* Tabs */}
      <div className="anim-2" style={{ display: 'flex', gap: '5px', marginBottom: '14px', background: '#fff', border: '2px solid #fef3c7', borderRadius: '16px', padding: '5px' }}>
        {tabs.map(t => (
          <button key={t.key} className="tab-btn" onClick={() => setActiveTab(t.key)}
            style={{ flex: 1, padding: '9px 6px', borderRadius: '11px', fontSize: '12px', fontWeight: 800, background: activeTab === t.key ? '#fef3c7' : 'transparent', color: activeTab === t.key ? '#1a1a26' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* STATS */}
      {activeTab === 'stats' && (
        <div className="anim-3">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            {profileLoading
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skel" style={{ height: '88px' }} />)
              : statCards.map(s => (
                <div key={s.label} className="pcard" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '16px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>{s.icon}</div>
                  <p style={{ fontWeight: 900, fontSize: '20px', color: s.color, margin: '0 0 2px' }}>{s.value}</p>
                  <p style={{ fontWeight: 700, fontSize: '11px', color: '#9ca3af', margin: 0 }}>{s.label}</p>
                </div>
              ))
            }
          </div>
          {!profileLoading && (
            <div className="pcard" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '14px', margin: 0 }}>Exercise Accuracy</p>
                <span style={{ fontWeight: 900, color: '#f59e0b', fontSize: '14px' }}>{accuracy}%</span>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${accuracy}%`, height: '100%', background: 'linear-gradient(90deg,#fbbf24,#f97316)', borderRadius: '999px', transition: 'width .6s ease' }} />
              </div>
              <p style={{ color: '#9ca3af', fontWeight: 600, fontSize: '12px', margin: '6px 0 0' }}>
                {profileStats?.correctAnswers ?? 0} correct out of {profileStats?.totalExercises ?? 0} attempts
              </p>
            </div>
          )}
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="anim-3" style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {achievements.map(a => (
            <div key={a.title} className="pcard" style={{ background: '#fff', border: `2px solid ${a.done ? '#fcd34d' : '#e5e7eb'}`, borderRadius: '16px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '12px', opacity: a.done ? 1 : 0.5 }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, background: a.done ? '#fef9f0' : '#f3f4f6', border: `2px solid ${a.done ? '#fde68a' : '#e5e7eb'}` }}>
                {a.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '13px', margin: '0 0 1px' }}>{a.title}</p>
                <p style={{ fontWeight: 600, color: '#9ca3af', fontSize: '11px', margin: 0 }}>{a.desc}</p>
              </div>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: a.done ? 'linear-gradient(135deg,#fbbf24,#f97316)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff', flexShrink: 0 }}>
                {a.done ? '✓' : '🔒'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === 'settings' && (
        <div className="anim-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="pcard" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: editingName ? '14px' : 0 }}>
              <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '14px', margin: 0 }}>Display Name</p>
              <button className="tab-btn" onClick={() => setEditingName(!editingName)}
                style={{ background: editingName ? '#f3f4f6' : '#fef3c7', color: editingName ? '#6b7280' : '#d97706', fontWeight: 800, fontSize: '12px', padding: '6px 14px', borderRadius: '10px', border: `2px solid ${editingName ? '#e5e7eb' : '#fcd34d'}` }}>
                {editingName ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {!editingName && <p style={{ color: '#6b7280', fontWeight: 600, fontSize: '13px', margin: '6px 0 0' }}>{user?.firstName || ''} {user?.lastName || ''} · @{user?.username || '—'}</p>}
            {editingName && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#1a1a26', display: 'block', marginBottom: '5px' }}>First name</label>
                    <input className="input-field" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#1a1a26', display: 'block', marginBottom: '5px' }}>Last name</label>
                    <input className="input-field" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button className="tab-btn" onClick={handleSave} disabled={saving}
                    style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)', color: '#fff', fontWeight: 800, fontSize: '13px', padding: '10px 20px', borderRadius: '12px', boxShadow: '0 4px 14px rgba(251,191,36,0.35)', opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  {saveMsg && <span style={{ fontWeight: 800, fontSize: '13px', color: saveMsg === 'Saved!' ? '#22c55e' : '#ef4444' }}>{saveMsg}</span>}
                </div>
              </div>
            )}
          </div>

          <div className="pcard" style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '14px', margin: '0 0 5px' }}>Email</p>
            <p style={{ color: '#6b7280', fontWeight: 600, fontSize: '13px', margin: '0 0 8px' }}>{user?.primaryEmailAddress?.emailAddress || '—'}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '3px 10px' }}>
              <span style={{ fontSize: '10px' }}>✓</span>
              <span style={{ color: '#15803d', fontSize: '11px', fontWeight: 800 }}>Verified</span>
            </div>
          </div>

          <div style={{ background: '#fff', border: '2px solid #fee2e2', borderRadius: '16px', padding: '18px' }}>
            <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '14px', margin: '0 0 5px' }}>Account</p>
            <p style={{ color: '#9ca3af', fontWeight: 600, fontSize: '12px', margin: '0 0 14px' }}>Sign out of Sayloop on this device.</p>
            <button onClick={async () => { await signOut(); navigate('/'); }}
              style={{ background: '#fef2f2', color: '#dc2626', fontWeight: 800, fontSize: '13px', padding: '10px 20px', borderRadius: '12px', border: '2px solid #fecaca', cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
              Sign out
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default ProfilePage;