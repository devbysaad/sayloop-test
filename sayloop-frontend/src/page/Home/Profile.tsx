import { useEffect, useState } from 'react';
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
  if (points >= 5000) return { name: 'Gold', color: '#f59e0b', icon: '🥇' };
  if (points >= 2000) return { name: 'Silver', color: '#9ca3af', icon: '🥈' };
  if (points >= 500) return { name: 'Bronze', color: '#f97316', icon: '🥉' };
  return { name: 'Rookie', color: '#a3e635', icon: '🌱' };
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
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 font-sans">
        <div className="w-10 h-10 border-4 border-[#fcd34d] border-t-[#f97316] rounded-full animate-spin" />
        <p className="text-[#9ca3af] font-bold text-[14px]">Loading profile...</p>
      </div>
    </PageShell>
  );

  const points = profileStats?.points ?? 0;
  const streak = profileStats?.streakLength ?? userRank?.streakLength ?? 0;
  const rank = profileStats?.rank ?? userRank?.rank ?? '—';
  const league = getLeague(points);
  const accuracy = profileStats?.accuracy ?? 0;
  const lessons = profileStats?.lessonsCompleted ?? 0;

  const statCards = [
    { icon: '🔥', label: 'Day Streak', value: `${streak}`, color: 'text-[#f97316]' },
    { icon: '⚡', label: 'Total XP', value: points.toLocaleString(), color: 'text-[#f59e0b]' },
    { icon: '🏆', label: 'Global Rank', value: `#${rank}`, color: 'text-[#8b5cf6]' },
    { icon: league.icon, label: 'League', value: league.name, color: 'text-[#a3e635]' },
    { icon: '📚', label: 'Lessons Done', value: `${lessons}`, color: 'text-[#10b981]' },
    { icon: '🎯', label: 'Accuracy', value: `${accuracy}%`, color: 'text-[#3b82f6]' },
  ];

  const achievements = [
    { icon: '🎙️', title: 'First Conversation', desc: 'Completed your first live session', done: true },
    { icon: '🔥', title: '3 Day Streak', desc: 'Practiced 3 days in a row', done: streak >= 3 },
    { icon: '⚡', title: 'XP Hunter', desc: 'Earned 500 XP total', done: points >= 500 },
    { icon: '🏆', title: 'Top 50', desc: 'Reached top 50 on leaderboard', done: typeof rank === 'number' && rank <= 50 },
    { icon: '📚', title: 'Scholar', desc: 'Complete 10 lessons', done: lessons >= 10 },
    { icon: '🎯', title: 'Sharp Shooter', desc: 'Achieve 80%+ accuracy', done: accuracy >= 80 },
  ];

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'stats', label: 'Stats', icon: '📊' },
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <PageShell>
      {/* Hero card */}
      <div className="animate-fade-in-up bg-linear-to-br from-[#1a1a26] to-[#2d2d3d] rounded-[24px] p-6 mb-3.5 relative overflow-hidden font-sans">
        <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle,#fde68a,transparent_65%)] opacity-[0.18]" />
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative shrink-0">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="avatar" className="w-[68px] h-[68px] rounded-[20px] border-[3px] border-[#fcd34d] object-cover shadow-lg" />
              : <div className="w-[68px] h-[68px] rounded-[20px] bg-linear-to-br from-[#fbbf24] to-[#f97316] flex items-center justify-center text-[28px] font-[900] text-white border-[3px] border-[#fcd34d] shadow-lg">
                {(user?.firstName?.[0] || user?.username?.[0] || '?').toUpperCase()}
              </div>
            }
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-[2.5px] border-[#1a1a26]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[#fffbf5] font-[900] text-[19px] m-0 mb-0.5 leading-tight">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username || 'Learner'}
            </h2>
            <p className="text-[#9ca3af] font-bold text-[12px] m-0 mb-1.5 uppercase tracking-wider opacity-80">@{user?.username || '—'}</p>
            <div className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 rounded-full px-2.5 py-1">
              <span>{league.icon}</span>
              <span className="text-[#f59e0b] font-[800] text-[11px] uppercase tracking-tighter">{league.name} League</span>
            </div>
          </div>
          <div className="bg-amber-500/12 border-2 border-amber-500/25 rounded-[14px] px-3.5 py-2.5 text-center shrink-0">
            {profileLoading
              ? <div className="h-[22px] w-12 mb-1 bg-linear-to-r from-[#f3f4f6] via-[#fef9f0] to-[#f3f4f6] bg-[length:200%_100%] animate-shimmer rounded-lg" />
              : <p className="text-[#f59e0b] font-[900] text-[22px] m-0 mb-px leading-none">{points.toLocaleString()}</p>
            }
            <p className="text-[#9ca3af] font-bold text-[10px] m-0 uppercase tracking-tighter opacity-70">Total XP</p>
          </div>
        </div>
        <p className="text-gray-500 font-[600] text-[11px] m-0 mt-3.5 opacity-60">
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
        </p>
      </div>

      {/* Tabs */}
      <div className="animate-fade-in-up [animation-delay:70ms] flex gap-1.5 mb-3.5 bg-white border-2 border-[#fef3c7] rounded-[16px] p-1.5 font-sans">
        {tabs.map(t => (
          <button key={t.key} className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-2.5 rounded-[11px] text-[12px] font-[800] transition-all duration-150 border-none cursor-pointer font-sans ${activeTab === t.key ? 'bg-[#fef3c7] text-[#1a1a26] shadow-sm' : 'bg-transparent text-[#9ca3af] hover:bg-gray-50'
            }`} onClick={() => setActiveTab(t.key)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* STATS */}
      {activeTab === 'stats' && (
        <div className="animate-fade-in-up [animation-delay:140ms] font-sans">
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            {profileLoading
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[88px] bg-linear-to-r from-[#f3f4f6] via-[#fef9f0] to-[#f3f4f6] bg-[length:200%_100%] animate-shimmer rounded-[16px]" />)
              : statCards.map(s => (
                <div key={s.label} className="group bg-white border-2 border-[#fef3c7] rounded-[16px] p-4 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="text-[24px] mb-1.5 transition-transform group-hover:scale-110">{s.icon}</div>
                  <p className={`font-[900] text-[20px] ${s.color} m-0 mb-0.5`}>{s.value}</p>
                  <p className="font-bold text-[11px] text-[#9ca3af] m-0 uppercase tracking-tighter">{s.label}</p>
                </div>
              ))
            }
          </div>
          {!profileLoading && (
            <div className="bg-white border-2 border-[#fef3c7] rounded-[16px] p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg">
              <div className="flex justify-between items-center mb-2.5">
                <p className="font-[900] text-[#1a1a26] text-[14px] m-0">Exercise Accuracy</p>
                <span className="font-[900] text-[#f59e0b] text-[14px]">{accuracy}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-[#fbbf24] to-[#f97316] h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <p className="text-[#9ca3af] font-[600] text-[12px] m-0 mt-1.5 italic">
                {profileStats?.correctAnswers ?? 0} correct out of {profileStats?.totalExercises ?? 0} attempts
              </p>
            </div>
          )}
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="animate-fade-in-up [animation-delay:140ms] flex flex-col gap-2.5 font-sans">
          {achievements.map(a => (
            <div key={a.title} className={`group bg-white border-2 rounded-[16px] px-4 py-3.5 shadow-sm flex items-center gap-3 transition-all hover:translate-x-1 ${a.done ? 'border-[#fcd34d] opacity-100' : 'border-gray-200 opacity-50 grayscale-[0.5]'
              }`}>
              <div className={`w-11 h-11 rounded-[13px] flex items-center justify-center text-[20px] shrink-0 border-2 transition-transform group-hover:scale-110 ${a.done ? 'bg-[#fef9f0] border-[#fde68a]' : 'bg-gray-100 border-gray-200'
                }`}>
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-[900] text-[#1a1a26] text-[13px] m-0 mb-px group-hover:text-amber-900 transition-colors">{a.title}</p>
                <p className="font-[600] text-[#9ca3af] text-[11px] m-0 leading-tight">{a.desc}</p>
              </div>
              <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] text-white shrink-0 font-bold transition-all ${a.done ? 'bg-linear-to-br from-[#fbbf24] to-[#f97316] shadow-sm' : 'bg-gray-200'
                }`}>
                {a.done ? '✓' : '🔒'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === 'settings' && (
        <div className="animate-fade-in-up [animation-delay:140ms] flex flex-col gap-3 font-sans">
          <div className="bg-white border-2 border-[#fef3c7] rounded-[16px] p-4.5 shadow-sm transition-all hover:shadow-md">
            <div className={`flex items-center justify-between ${editingName ? 'mb-3.5' : 'mb-0'}`}>
              <p className="font-[900] text-[#1a1a26] text-[14px] m-0 uppercase tracking-tighter">Display Name</p>
              <button className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-[800] border-2 cursor-pointer transition-all ${editingName ? 'bg-gray-100 text-[#6b7280] border-gray-200 hover:bg-gray-200' : 'bg-[#fef3c7] text-[#d97706] border-[#fcd34d] hover:bg-amber-100'
                }`} onClick={() => setEditingName(!editingName)}>
                {editingName ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {!editingName && (
              <p className="text-gray-500 font-[600] text-[13px] m-0 mt-1.5 flex items-center gap-1.5 italic">
                <span>{user?.firstName || ''} {user?.lastName || ''}</span>
                <span className="opacity-60">·</span>
                <span className="font-bold text-gray-400">@{user?.username || '—'}</span>
              </p>
            )}
            {editingName && (
              <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[12px] font-[800] text-[#1a1a26] block mb-1 opacity-70 uppercase tracking-widest">First name</label>
                    <input className="w-full px-3.5 py-2.5 rounded-[12px] border-2 border-gray-200 bg-white text-[14px] font-[600] text-[#1a1a26] outline-none transition-all focus:border-amber-500 placeholder:text-gray-300"
                      value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
                  </div>
                  <div>
                    <label className="text-[12px] font-[800] text-[#1a1a26] block mb-1 opacity-70 uppercase tracking-widest">Last name</label>
                    <input className="w-full px-3.5 py-2.5 rounded-[12px] border-2 border-gray-200 bg-white text-[14px] font-[600] text-[#1a1a26] outline-none transition-all focus:border-amber-500 placeholder:text-gray-300"
                      value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
                  </div>
                </div>
                <div className="flex items-center gap-2.5 mt-1">
                  <button
                    className={`bg-linear-to-br from-[#fbbf24] to-[#f97316] text-white font-[800] text-[13px] px-5 py-2.5 rounded-[12px] shadow-lg transition-all active:scale-95 border-none cursor-pointer ${saving ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-amber-200'}`}
                    onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  {saveMsg && <span className={`font-bold text-[13px] animate-fade-in-up ${saveMsg === 'Saved!' ? 'text-green-500' : 'text-red-500'}`}>{saveMsg}</span>}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border-2 border-[#fef3c7] rounded-[16px] p-4.5 shadow-sm transition-all hover:shadow-md">
            <p className="font-[900] text-[#1a1a26] text-[14px] m-0 mb-1 opacity-80 uppercase tracking-tighter">Email Address</p>
            <p className="text-gray-500 font-[600] text-[13px] m-0 mb-2">{user?.primaryEmailAddress?.emailAddress || '—'}</p>
            <div className="inline-flex items-center gap-1 bg-green-100 border border-green-200 rounded-full px-2.5 py-0.5 shadow-xs">
              <span className="text-[10px] text-green-700">✓</span>
              <span className="text-green-800 text-[11px] font-[800] uppercase tracking-tighter">Verified Account</span>
            </div>
          </div>

          <div className="bg-white border-2 border-red-100 rounded-[16px] p-4.5 shadow-sm transition-all hover:shadow-red-50">
            <p className="font-[900] text-[#1a1a26] text-[14px] m-0 mb-1 opacity-80 uppercase tracking-tighter">Danger Zone</p>
            <p className="text-[#9ca3af] font-[600] text-[12px] m-0 mb-3.5 leading-tight">Sign out of your Sayloop account on this device.</p>
            <button className="bg-red-50 text-red-600 font-[800] text-[13px] px-5 py-2.5 rounded-[12px] border-2 border-red-200 cursor-pointer transition-all hover:bg-red-100 active:scale-95 shadow-xs font-sans"
              onClick={async () => { await signOut(); navigate('/'); }}>
              Logout 🚪
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default ProfilePage;