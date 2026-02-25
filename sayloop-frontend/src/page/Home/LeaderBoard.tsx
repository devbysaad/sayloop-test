import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '@clerk/clerk-react';
import type { RootState } from '../../redux/store';
import {
  fetchLeaderboardRequest,
  fetchUserRankRequest,
  type LeaderboardEntry,
} from '../../redux/slice/leaderboard.slice';
import PageShell from '../../components/modules/home/PageShell';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const getLeague = (points: number) => {
  if (points >= 10000) return { name: 'Diamond', color: '#60a5fa', icon: '💎' };
  if (points >= 5000) return { name: 'Gold', color: '#f59e0b', icon: '🥇' };
  if (points >= 2000) return { name: 'Silver', color: '#9ca3af', icon: '🥈' };
  if (points >= 500) return { name: 'Bronze', color: '#f97316', icon: '🥉' };
  return { name: 'Rookie', color: '#a3e635', icon: '🌱' };
};

const AVATAR_COLORS = ['#fbbf24', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const Avatar = ({ entry, size = 40 }: { entry: LeaderboardEntry; size?: number }) => {
  const initial = (entry.firstName?.[0] || entry.username?.[0] || '?').toUpperCase();
  const color = AVATAR_COLORS[entry.id % AVATAR_COLORS.length];
  return entry.pfpSource
    ? <img src={entry.pfpSource ?? undefined} alt={entry.username}
      className="rounded-full object-cover border-2 border-[#fef3c7]"
      style={{ width: size, height: size }} />
    : <div className="rounded-full border-2 border-[#fef3c7] flex items-center justify-center font-[900] text-white shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
      {initial}
    </div>;
};

const MEDAL = [
  { bg: 'from-[#fef3c7] to-white', border: 'border-[#fbbf24]', emoji: '🥇' },
  { bg: 'from-[#f3f4f6] to-white', border: 'border-[#9ca3af]', emoji: '🥈' },
  { bg: 'from-[#fff7ed] to-white', border: 'border-[#f97316]', emoji: '🥉' },
];

const PodiumCard = ({ entry, height, crown }: { entry: LeaderboardEntry; height: number; crown?: boolean }) => {
  const m = MEDAL[entry.rank - 1];
  return (
    <div className="flex-1 max-w-[140px] flex flex-col items-center gap-1.5 animate-pop">
      {crown && <span className="text-[20px]">👑</span>}
      <Avatar entry={entry} size={crown ? 52 : 42} />
      <p className="font-[900] text-[#1a1a26] text-[11px] m-0 text-center max-w-[110px] overflow-hidden text-ellipsis whitespace-nowrap">
        {entry.firstName || entry.username}
      </p>
      <p className="font-[800] text-[#f59e0b] text-[12px] m-0">{entry.points.toLocaleString()} XP</p>
      <div className={`w-full bg-linear-to-b ${m.bg} border-2 ${m.border} rounded-t-[14px] flex items-center justify-center text-[22px]`}
        style={{ height }}>
        {m.emoji}
      </div>
    </div>
  );
};

const SkeletonRow = () => (
  <div className="h-[62px] rounded-[16px] bg-linear-to-r from-[#f3f4f6] via-[#fef9f0] to-[#f3f4f6] bg-[length:200%_100%] animate-shimmer" />
);

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
const LeaderboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const [page, setPage] = useState(0);
  const LIMIT = 20;

  // ✅ reads from state.leaderboard (set in store)
  const { leaderboard, userRank, leaderboardLoading, leaderboardError } =
    useSelector((s: RootState) => s.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboardRequest({ page, limit: LIMIT }));
  }, [dispatch, page]);

  useEffect(() => {
    const dbUserId = localStorage.getItem('db_user_id');
    if (dbUserId) {
      dispatch(fetchUserRankRequest({ userId: parseInt(dbUserId) }));
    }
  }, [dispatch]);

  const entries: LeaderboardEntry[] = leaderboard?.data ?? [];
  const totalPages = leaderboard?.totalPages ?? 1;
  const top3 = page === 0 ? entries.slice(0, 3) : [];
  const rest = page === 0 ? entries.slice(3) : entries;

  return (
    <PageShell>
      {/* Header */}
      <div className="animate-fade-in-up mb-5 font-sans">
        <p className="text-[#9ca3af] text-[13px] font-bold m-0 mb-0.5">This week</p>
        <h1 className="text-[clamp(22px,5vw,30px)] font-[900] text-[#1a1a26] m-0">Leaderboard 🏆</h1>
      </div>

      {/* Your rank banner */}
      {userRank && (
        <div className="animate-fade-in-up [animation-delay:70ms] bg-linear-to-br from-[#1a1a26] to-[#2d2d3d] rounded-[20px] px-5 py-4 mb-4 flex items-center gap-3.5 relative overflow-hidden font-sans">
          <div className="absolute -top-7 -right-7 w-30 h-30 rounded-full bg-[radial-gradient(circle,#fde68a,transparent_65%)] opacity-[0.18]" />
          <div className="w-[46px] h-[46px] rounded-[14px] bg-linear-to-br from-[#fbbf24] to-[#f97316] flex items-center justify-center font-[900] text-[16px] text-white shrink-0">
            #{userRank.rank}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#fffbf5] font-[900] text-[14px] m-0 mb-0.5">Your rank</p>
            <p className="text-[#9ca3af] font-[600] text-[12px] m-0">
              {getLeague(userRank.points).icon} {getLeague(userRank.points).name} League · 🔥 {userRank.streakLength}d streak
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[#f59e0b] font-[900] text-[18px] m-0">{userRank.points.toLocaleString()}</p>
            <p className="text-[#6b7280] font-bold text-[11px] m-0">XP</p>
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {leaderboardLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {/* Error */}
      {leaderboardError && !leaderboardLoading && (
        <div className="bg-red-50 border-2 border-red-200 rounded-[18px] p-6 text-center font-sans">
          <p className="text-red-600 font-[800] text-[14px] m-0 mb-3">Failed to load leaderboard</p>
          <button onClick={() => dispatch(fetchLeaderboardRequest({ page, limit: LIMIT }))}
            className="bg-linear-to-br from-[#fbbf24] to-[#f97316] text-white font-[800] text-[13px] px-5 py-2.5 rounded-[12px] border-none cursor-pointer font-sans shadow-md">
            Try again
          </button>
        </div>
      )}

      {/* Podium — top 3 */}
      {!leaderboardLoading && !leaderboardError && top3.length === 3 && (
        <div className="animate-fade-in-up [animation-delay:140ms] mb-4 font-sans">
          <div className="flex items-end justify-center gap-1.5 mb-4">
            <PodiumCard entry={top3[1]} height={90} />
            <PodiumCard entry={top3[0]} height={120} crown />
            <PodiumCard entry={top3[2]} height={72} />
          </div>
        </div>
      )}

      {/* Ranked rows */}
      {!leaderboardLoading && !leaderboardError && rest.length > 0 && (
        <div className="animate-fade-in-up [animation-delay:210ms] flex flex-col gap-2 mb-4 font-sans">
          {rest.map((entry) => {
            const league = getLeague(entry.points);
            const isMe = user?.username === entry.username;
            const medalEmoji = entry.rank <= 3 && page === 0 ? MEDAL[entry.rank - 1].emoji : null;
            return (
              <div key={entry.id} className={`group bg-white border-2 rounded-[16px] px-4 py-3 flex items-center gap-3 transition-all duration-150 hover:translate-x-1 shadow-xs ${isMe ? 'bg-amber-50/50 border-amber-300' : 'bg-white border-[#fef3c7]'
                }`}>
                <div className="w-8 text-center shrink-0">
                  {medalEmoji ? <span className="text-[18px]">{medalEmoji}</span> : <span className="font-[900] text-[13px] text-gray-400">#{entry.rank}</span>}
                </div>
                <Avatar entry={entry} size={38} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-[900] text-[#1a1a26] text-[13px] m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                      {entry.firstName ? `${entry.firstName} ${entry.lastName || ''}`.trim() : entry.username}
                    </p>
                    {isMe && <span className="bg-linear-to-br from-[#fbbf24] to-[#f97316] text-white text-[9px] font-[900] px-2 py-0.5 rounded-full uppercase tracking-tighter">You</span>}
                  </div>
                  <p className="text-[#9ca3af] font-[600] text-[11px] m-0 mt-0.5">{league.icon} {league.name} · 🔥 {entry.streakLength}d</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-[900] text-[#f59e0b] text-[15px] m-0">{entry.points.toLocaleString()}</p>
                  <p className="font-[600] text-[#9ca3af] text-[10px] m-0">XP</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!leaderboardLoading && !leaderboardError && entries.length === 0 && (
        <div className="text-center py-14 px-5 font-sans">
          <div className="text-[48px] mb-3">🏆</div>
          <p className="font-[900] text-[#1a1a26] text-[16px] m-0 mb-1.5">No one here yet</p>
          <p className="font-[600] text-[#9ca3af] text-[13px] m-0">Complete lessons to earn XP and appear on the leaderboard!</p>
        </div>
      )}

      {/* Pagination */}
      {!leaderboardLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2.5 font-sans">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className={`bg-white border-2 border-[#fef3c7] rounded-[12px] px-[18px] py-2.5 font-bold text-[13px] text-[#1a1a26] cursor-pointer transition-all active:scale-95 font-sans ${page === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}>
            ← Prev
          </button>
          <div className="bg-[#fef3c7] border-2 border-[#fcd34d] rounded-[12px] px-[18px] py-2.5 font-[900] text-[13px] text-[#d97706]">
            {page + 1} / {totalPages}
          </div>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
            className={`bg-white border-2 border-[#fef3c7] rounded-[12px] px-[18px] py-2.5 font-bold text-[13px] text-[#1a1a26] cursor-pointer transition-all active:scale-95 font-sans ${page >= totalPages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}>
            Next →
          </button>
        </div>
      )}
    </PageShell>
  );
};

export default LeaderboardPage;