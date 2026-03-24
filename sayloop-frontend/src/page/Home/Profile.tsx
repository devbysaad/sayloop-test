import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import { fetchProfileStatsRequest } from '../../redux/slice/profile.slice';
import { fetchUserRankRequest, type UserRank } from '../../redux/slice/leaderboard.slice';
import PageShell from '../../components/modules/home/PageShell';
import ProfileHeroCard from '../../components/modules/profile/ProfileHeroCard';
import ProfileTabs, { type Tab } from '../../components/modules/profile/ProfileTab';
import ProfileStatsTab from '../../components/modules/profile/ProfileStatsTab';
import ProfileAchievementsTab from '../../components/modules/profile/ProfileAchievementsTab';
import ProfileSettingsTab from '../../components/modules/profile/ProfileSettingTab';

const getLeague = (points: number) => {
  if (points >= 10000) return { name: 'Diamond', color: '#60a5fa', icon: '💎' };
  if (points >= 5000) return { name: 'Gold', color: '#f59e0b', icon: '🥇' };
  if (points >= 2000) return { name: 'Silver', color: '#9ca3af', icon: '🥈' };
  if (points >= 500) return { name: 'Bronze', color: '#f97316', icon: '🥉' };
  return { name: 'Rookie', color: '#a3e635', icon: '🌱' };
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const { profileStats, profileLoading } = useSelector((s: RootState) => s.profile);
  const { userRank } = useSelector((s: RootState) => s.leaderboard);

  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [noUser, setNoUser] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('db_user_id');
    if (!raw) { setNoUser(true); return; }
    const uid = parseInt(raw, 10);
    if (isNaN(uid)) { setNoUser(true); return; }
    dispatch(fetchProfileStatsRequest({ userId: uid }));
    dispatch(fetchUserRankRequest({ userId: uid }));
  }, [dispatch]);

  if (!isLoaded) return (
    <PageShell>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-amber-300 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-gray-400 font-bold text-sm">Loading profile...</p>
      </div>
    </PageShell>
  );

  if (noUser) return (
    <PageShell>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center px-6">
        <p className="text-2xl">⚠️</p>
        <p className="font-bold text-gray-700 text-base">Profile not synced yet.</p>
        <p className="text-gray-400 text-sm font-medium">Try signing out and back in, or refresh the page.</p>
        <button
          className="mt-2 px-5 py-2.5 rounded-xl bg-amber-100 text-amber-700 font-bold text-sm border-2 border-amber-300 hover:bg-amber-200 transition"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    </PageShell>
  );

  const points   = profileStats?.points ?? 0;
  const typedRank = userRank as UserRank | null;
  const streak   = profileStats?.streakLength ?? typedRank?.streakLength ?? 0;
  const rank     = profileStats?.rank ?? typedRank?.rank ?? '—';
  const accuracy = profileStats?.accuracy ?? 0;
  const lessons  = profileStats?.lessonsCompleted ?? 0;
  const league   = getLeague(points);

  const achievements = [
    { icon: '🎙️', title: 'First Conversation', desc: 'Completed your first live session', done: true },
    { icon: '🔥', title: '3 Day Streak', desc: 'Practiced 3 days in a row', done: streak >= 3 },
    { icon: '⚡', title: 'XP Hunter', desc: 'Earned 500 XP total', done: points >= 500 },
    { icon: '🏆', title: 'Top 50', desc: 'Reached top 50 on leaderboard', done: typeof rank === 'number' && rank <= 50 },
    { icon: '📚', title: 'Scholar', desc: 'Complete 10 lessons', done: lessons >= 10 },
    { icon: '🎯', title: 'Sharp Shooter', desc: 'Achieve 80%+ accuracy', done: accuracy >= 80 },
  ];

  return (
    <PageShell>
      <ProfileHeroCard
        points={points}
        league={league}
        profileLoading={profileLoading}
      />

      <ProfileTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'stats' && (
        <ProfileStatsTab
          profileStats={profileStats}
          profileLoading={profileLoading}
          points={points}
          streak={streak}
          rank={rank}
          accuracy={accuracy}
          lessons={lessons}
          league={league}
        />
      )}

      {activeTab === 'achievements' && (
        <ProfileAchievementsTab achievements={achievements} />
      )}

      {activeTab === 'settings' && (
        <ProfileSettingsTab />
      )}
    </PageShell>
  );
};

export default ProfilePage;