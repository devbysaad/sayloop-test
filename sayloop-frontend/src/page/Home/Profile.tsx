import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import { fetchProfileStatsRequest } from '../../redux/slice/profile.slice';
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

const SkeletonCard = () => (
  <div className="h-[88px] rounded-[16px] bg-gradient-to-r from-gray-100 via-amber-50 to-gray-100 bg-[length:200%_100%] animate-pulse" />
);

const ProfilePage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, isLoaded } = useUser();
  const { signOut }        = useClerk();

  const { profileStats, profileLoading } = useSelector((s: RootState) => s.profile);
  const { userRank }                     = useSelector((s: RootState) => s.leaderboard);

  const [activeTab,    setActiveTab]    = useState<Tab>('stats');
  const [editingName,  setEditingName]  = useState(false);
  const [firstName,    setFirstName]    = useState('');
  const [lastName,     setLastName]     = useState('');
  const [saving,       setSaving]       = useState(false);
  const [saveMsg,      setSaveMsg]      = useState('');
  const [noUser,       setNoUser]       = useState(false);

  // ── Fetch stats once db_user_id is available ──────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem('db_user_id');
    if (!raw) {
      setNoUser(true);
      return;
    }
    const uid = parseInt(raw, 10);
    if (isNaN(uid)) { setNoUser(true); return; }

    dispatch(fetchProfileStatsRequest({ userId: uid }));
    dispatch(fetchUserRankRequest({ userId: uid }));
  }, [dispatch]);

  // ── Populate name fields from Clerk user ──────────────────────────────────
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName  ?? '');
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
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (!isLoaded) return (
    <PageShell>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-amber-300 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-gray-400 font-bold text-sm">Loading profile...</p>
      </div>
    </PageShell>
  );

  // ── No DB user found (sync hasn't run yet) ────────────────────────────────
  if (noUser) return (
    <PageShell>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center px-6">
        <p className="text-2xl">⚠️</p>
        <p className="font-bold text-gray-700 text-base">Profile not synced yet.</p>
        <p className="text-gray-400 text-sm font-medium">
          Try signing out and back in, or refresh the page.
        </p>
        <button
          className="mt-2 px-5 py-2.5 rounded-xl bg-amber-100 text-amber-700 font-bold text-sm border-2 border-amber-300 hover:bg-amber-200 transition"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    </PageShell>
  );

  // ── Derived values ────────────────────────────────────────────────────────
  const points   = profileStats?.points        ?? 0;
  // fallback chain: profileStats → userRank → 0
  const streak   = profileStats?.streakLength  ?? (userRank as any)?.streakLength ?? 0;
  const rank     = profileStats?.rank          ?? (userRank as any)?.rank         ?? '—';
  const accuracy = profileStats?.accuracy      ?? 0;
  const lessons  = profileStats?.lessonsCompleted ?? 0;
  const league   = getLeague(points);

  // Clerk createdAt is a Date object
  const memberSince = user?.createdAt instanceof Date
    ? user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  const statCards = [
    { icon: '🔥', label: 'Day Streak',   value: `${streak}`,              color: 'text-orange-500' },
    { icon: '⚡', label: 'Total XP',     value: points.toLocaleString(),  color: 'text-amber-500'  },
    { icon: '🏆', label: 'Global Rank',  value: `#${rank}`,               color: 'text-violet-500' },
    { icon: league.icon, label: 'League',value: league.name,              color: 'text-lime-400'   },
    { icon: '📚', label: 'Lessons Done', value: `${lessons}`,             color: 'text-emerald-500'},
    { icon: '🎯', label: 'Accuracy',     value: `${accuracy}%`,           color: 'text-blue-500'   },
  ];

  const achievements = [
    { icon: '🎙️', title: 'First Conversation', desc: 'Completed your first live session',  done: true },
    { icon: '🔥', title: '3 Day Streak',        desc: 'Practiced 3 days in a row',          done: streak >= 3 },
    { icon: '⚡', title: 'XP Hunter',           desc: 'Earned 500 XP total',                done: points >= 500 },
    { icon: '🏆', title: 'Top 50',              desc: 'Reached top 50 on leaderboard',      done: typeof rank === 'number' && rank <= 50 },
    { icon: '📚', title: 'Scholar',             desc: 'Complete 10 lessons',                done: lessons >= 10 },
    { icon: '🎯', title: 'Sharp Shooter',       desc: 'Achieve 80%+ accuracy',              done: accuracy >= 80 },
  ];

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'stats',        label: 'Stats',        icon: '📊' },
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
    { key: 'settings',     label: 'Settings',     icon: '⚙️' },
  ];

  return (
    <PageShell>

      {/* ── Hero card ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#1a1a26] to-[#2d2d3d] rounded-[24px] p-6 mb-3.5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[radial-gradient(circle,#fde68a,transparent_65%)] opacity-20 pointer-events-none" />

        <div className="flex items-center gap-4 flex-wrap">
          {/* Avatar */}
          <div className="relative shrink-0">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="avatar"
                className="w-[68px] h-[68px] rounded-[20px] border-[3px] border-amber-300 object-cover shadow-lg"
              />
            ) : (
              <div className="w-[68px] h-[68px] rounded-[20px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[28px] font-black text-white border-[3px] border-amber-300 shadow-lg">
                {(user?.firstName?.[0] ?? user?.username?.[0] ?? '?').toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-[2.5px] border-[#1a1a26]" />
          </div>

          {/* Name / league */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-black text-[19px] m-0 mb-0.5 leading-tight truncate">
              {user?.firstName
                ? `${user.firstName} ${user.lastName ?? ''}`.trim()
                : user?.username ?? 'Learner'}
            </h2>
            <p className="text-gray-400 font-bold text-[12px] m-0 mb-1.5 uppercase tracking-wider">
              @{user?.username ?? '—'}
            </p>
            <div className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 rounded-full px-2.5 py-1">
              <span>{league.icon}</span>
              <span className="text-amber-500 font-extrabold text-[11px] uppercase tracking-tight">
                {league.name} League
              </span>
            </div>
          </div>

          {/* XP badge */}
          <div className="bg-amber-500/10 border-2 border-amber-500/25 rounded-[14px] px-3.5 py-2.5 text-center shrink-0">
            {profileLoading ? (
              <div className="h-[22px] w-12 mb-1 rounded-lg bg-gradient-to-r from-gray-200 via-amber-50 to-gray-200 animate-pulse" />
            ) : (
              <p className="text-amber-500 font-black text-[22px] m-0 mb-px leading-none">
                {points.toLocaleString()}
              </p>
            )}
            <p className="text-gray-400 font-bold text-[10px] m-0 uppercase tracking-tight opacity-70">
              Total XP
            </p>
          </div>
        </div>

        <p className="text-gray-500 font-semibold text-[11px] m-0 mt-3.5 opacity-60">
          Member since {memberSince}
        </p>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-3.5 bg-white border-2 border-amber-100 rounded-[16px] p-1.5">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-2.5 rounded-[11px] text-[12px] font-extrabold transition-all border-none cursor-pointer
              ${activeTab === t.key
                ? 'bg-amber-100 text-gray-900 shadow-sm'
                : 'bg-transparent text-gray-400 hover:bg-gray-50'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Stats tab ──────────────────────────────────────────────────────── */}
      {activeTab === 'stats' && (
        <div>
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            {profileLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : statCards.map(s => (
                <div
                  key={s.label}
                  className="group bg-white border-2 border-amber-100 rounded-[16px] p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="text-[24px] mb-1.5 transition-transform group-hover:scale-110">{s.icon}</div>
                  <p className={`font-black text-[20px] ${s.color} m-0 mb-0.5`}>{s.value}</p>
                  <p className="font-bold text-[11px] text-gray-400 m-0 uppercase tracking-tight">{s.label}</p>
                </div>
              ))
            }
          </div>

          {!profileLoading && (
            <div className="bg-white border-2 border-amber-100 rounded-[16px] p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2.5">
                <p className="font-black text-gray-900 text-[14px] m-0">Exercise Accuracy</p>
                <span className="font-black text-amber-500 text-[14px]">{accuracy}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(accuracy, 100)}%` }}
                />
              </div>
              <p className="text-gray-400 font-semibold text-[12px] m-0 mt-1.5 italic">
                {profileStats?.correctAnswers ?? 0} correct out of {profileStats?.totalExercises ?? 0} attempts
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Achievements tab ───────────────────────────────────────────────── */}
      {activeTab === 'achievements' && (
        <div className="flex flex-col gap-2.5">
          {achievements.map(a => (
            <div
              key={a.title}
              className={`group bg-white border-2 rounded-[16px] px-4 py-3.5 shadow-sm flex items-center gap-3 transition-all hover:translate-x-1
                ${a.done ? 'border-amber-300' : 'border-gray-200 opacity-50 grayscale-[0.4]'}`}
            >
              <div className={`w-11 h-11 rounded-[13px] flex items-center justify-center text-[20px] shrink-0 border-2 transition-transform group-hover:scale-110
                ${a.done ? 'bg-amber-50 border-amber-200' : 'bg-gray-100 border-gray-200'}`}>
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-[13px] m-0 mb-px">{a.title}</p>
                <p className="font-semibold text-gray-400 text-[11px] m-0 leading-tight">{a.desc}</p>
              </div>
              <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] text-white shrink-0 font-bold
                ${a.done ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm' : 'bg-gray-200'}`}>
                {a.done ? '✓' : '🔒'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Settings tab ───────────────────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <div className="flex flex-col gap-3">

          {/* Display name */}
          <div className="bg-white border-2 border-amber-100 rounded-[16px] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="font-black text-gray-900 text-[14px] m-0 uppercase tracking-tight">Display Name</p>
              <button
                onClick={() => { setEditingName(!editingName); setSaveMsg(''); }}
                className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-extrabold border-2 cursor-pointer transition-all
                  ${editingName
                    ? 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                    : 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200'}`}
              >
                {editingName ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {!editingName && (
              <p className="text-gray-500 font-semibold text-[13px] m-0 mt-1.5 flex items-center gap-1.5 italic">
                <span>{user?.firstName ?? ''} {user?.lastName ?? ''}</span>
                <span className="opacity-50">·</span>
                <span className="font-bold text-gray-400">@{user?.username ?? '—'}</span>
              </p>
            )}

            {editingName && (
              <div className="flex flex-col gap-2.5 mt-3">
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'First name', value: firstName, set: setFirstName },
                    { label: 'Last name',  value: lastName,  set: setLastName  },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="text-[11px] font-extrabold text-gray-700 block mb-1 uppercase tracking-widest opacity-70">
                        {f.label}
                      </label>
                      <input
                        className="w-full px-3.5 py-2.5 rounded-[12px] border-2 border-gray-200 bg-white text-[14px] font-semibold text-gray-900 outline-none transition-all focus:border-amber-400 placeholder:text-gray-300"
                        value={f.value}
                        onChange={e => f.set(e.target.value)}
                        placeholder={f.label}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2.5 mt-1">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-extrabold text-[13px] px-5 py-2.5 rounded-[12px] shadow-md transition-all active:scale-95 border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  {saveMsg && (
                    <span className={`font-bold text-[13px] ${saveMsg === 'Saved!' ? 'text-green-500' : 'text-red-500'}`}>
                      {saveMsg}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="bg-white border-2 border-amber-100 rounded-[16px] p-4 shadow-sm">
            <p className="font-black text-gray-900 text-[14px] m-0 mb-1 uppercase tracking-tight opacity-80">
              Email Address
            </p>
            <p className="text-gray-500 font-semibold text-[13px] m-0 mb-2">
              {user?.primaryEmailAddress?.emailAddress ?? '—'}
            </p>
            <div className="inline-flex items-center gap-1 bg-green-100 border border-green-200 rounded-full px-2.5 py-0.5">
              <span className="text-green-700 text-[10px]">✓</span>
              <span className="text-green-800 text-[11px] font-extrabold uppercase tracking-tight">Verified Account</span>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white border-2 border-red-100 rounded-[16px] p-4 shadow-sm">
            <p className="font-black text-gray-900 text-[14px] m-0 mb-1 uppercase tracking-tight opacity-80">
              Danger Zone
            </p>
            <p className="text-gray-400 font-semibold text-[12px] m-0 mb-3.5 leading-tight">
              Sign out of your Sayloop account on this device.
            </p>
            <button
              onClick={async () => { await signOut(); navigate('/'); }}
              className="bg-red-50 text-red-600 font-extrabold text-[13px] px-5 py-2.5 rounded-[12px] border-2 border-red-200 cursor-pointer transition-all hover:bg-red-100 active:scale-95 shadow-sm"
            >
              Logout 🚪
            </button>
          </div>

        </div>
      )}
    </PageShell>
  );
};

export default ProfilePage;