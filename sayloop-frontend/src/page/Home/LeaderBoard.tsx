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

const getLeague = (points: number) => {
  if (points >= 10000) return { name: 'Diamond', color: '#60a5fa', icon: '💎' };
  if (points >= 5000) return { name: 'Gold', color: '#B45309', icon: '🥇' };
  if (points >= 2000) return { name: 'Silver', color: '#888', icon: '🥈' };
  if (points >= 500) return { name: 'Bronze', color: '#E8480C', icon: '🥉' };
  return { name: 'Rookie', color: '#3D7A5C', icon: '🌱' };
};

const AVATAR_COLORS = ['#E8480C', '#3D7A5C', '#B45309', '#141414', '#60a5fa', '#ec4899'];

const Avatar = ({ entry, size = 40 }: { entry: LeaderboardEntry; size?: number }) => {
  const initial = (entry.firstName?.[0] || entry.username?.[0] || '?').toUpperCase();
  const color = AVATAR_COLORS[entry.id % AVATAR_COLORS.length];
  return entry.pfpSource
    ? <img src={entry.pfpSource ?? undefined} alt={entry.username ?? undefined}
      className="rounded-full object-cover"
      style={{ width: size, height: size, border: '2px solid rgba(20,20,20,0.08)' }} />
    : <div className="rounded-full flex items-center justify-center font-black text-white shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38, border: '2px solid rgba(20,20,20,0.08)' }}>
      {initial}
    </div>;
};

const MEDAL = [
  { bg: '#FEF8EF', border: 'rgba(180,83,9,0.25)', emoji: '🥇' },
  { bg: '#F4F4F4', border: 'rgba(20,20,20,0.12)', emoji: '🥈' },
  { bg: '#FFF4EF', border: 'rgba(232,72,12,0.2)', emoji: '🥉' },
];

const PodiumCard = ({ entry, height, crown }: { entry: LeaderboardEntry; height: number; crown?: boolean }) => {
  const m = MEDAL[entry.rank - 1];
  return (
    <div className="flex-1 max-w-[140px] flex flex-col items-center gap-1.5">
      {crown && <span className="text-[20px]">👑</span>}
      <Avatar entry={entry} size={crown ? 52 : 42} />
      <p className="font-black text-[#141414] text-[11px] m-0 text-center max-w-[110px] overflow-hidden text-ellipsis whitespace-nowrap">
        {entry.firstName || entry.username}
      </p>
      <p className="font-black text-[#B45309] text-[12px] m-0">{entry.points.toLocaleString()} XP</p>
      <div className="w-full rounded-t-xl flex items-center justify-center text-[22px]"
        style={{ height, background: m.bg, border: `1.5px solid ${m.border}` }}>
        {m.emoji}
      </div>
    </div>
  );
};

const SkeletonRow = () => (
  <div className="h-[62px] rounded-xl animate-pulse" style={{ background: 'rgba(20,20,20,0.05)' }} />
);

const LeaderboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const [page, setPage] = useState(0);
  const LIMIT = 20;

  const { leaderboard, userRank, leaderboardLoading, leaderboardError } =
    useSelector((s: RootState) => s.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboardRequest({ page, limit: LIMIT }));
  }, [dispatch, page]);

  useEffect(() => {
    const dbUserId = localStorage.getItem('db_user_id');
    if (dbUserId) dispatch(fetchUserRankRequest({ userId: parseInt(dbUserId) }));
  }, [dispatch]);

  const entries: LeaderboardEntry[] = leaderboard?.data ?? [];
  const totalPages = leaderboard?.totalPages ?? 1;
  const top3 = page === 0 ? entries.slice(0, 3) : [];
  const rest = page === 0 ? entries.slice(3) : entries;

  return (
    <PageShell>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800;900&display=swap');`}</style>
      <div className="mb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <p className="text-[#141414]/40 text-[13px] font-normal m-0 mb-0.5">This week</p>
        <h1 className="text-[clamp(22px,5vw,30px)] font-black text-[#141414] m-0" style={{ letterSpacing: '-0.5px' }}>Leaderboard 🏆</h1>
      </div>

      {userRank && (
        <div className="rounded-xl px-5 py-4 mb-4 flex items-center gap-3.5 relative overflow-hidden"
          style={{ background: '#141414', fontFamily: "'Outfit', sans-serif" }}>
          <div className="absolute -top-7 -right-7 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(232,72,12,0.25),transparent 65%)' }} />
          <div className="w-[46px] h-[46px] rounded-xl flex items-center justify-center font-black text-[16px] text-white shrink-0"
            style={{ background: '#E8480C' }}>
            #{userRank.rank}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-[14px] m-0 mb-0.5">Your rank</p>
            <p className="text-white/40 font-normal text-[12px] m-0">
              {getLeague(userRank.points).icon} {getLeague(userRank.points).name} League · 🔥 {userRank.streakLength}d streak
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-black text-[18px] m-0" style={{ color: '#E8480C' }}>{userRank.points.toLocaleString()}</p>
            <p className="text-white/30 font-normal text-[11px] m-0">XP</p>
          </div>
        </div>
      )}

      {leaderboardLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {leaderboardError && !leaderboardLoading && (
        <div className="rounded-xl p-6 text-center" style={{ background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.2)', fontFamily: "'Outfit', sans-serif" }}>
          <p className="font-black text-[14px] m-0 mb-3" style={{ color: '#E8480C' }}>Failed to load leaderboard</p>
          <button onClick={() => dispatch(fetchLeaderboardRequest({ page, limit: LIMIT }))}
            className="text-white font-black text-[13px] px-5 py-2.5 rounded-xl border-none cursor-pointer shadow-sm"
            style={{ background: '#E8480C' }}>
            Try again
          </button>
        </div>
      )}

      {!leaderboardLoading && !leaderboardError && top3.length === 3 && (
        <div className="mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <div className="flex items-end justify-center gap-2 mb-4">
            <PodiumCard entry={top3[1]} height={90} />
            <PodiumCard entry={top3[0]} height={120} crown />
            <PodiumCard entry={top3[2]} height={72} />
          </div>
        </div>
      )}

      {!leaderboardLoading && !leaderboardError && rest.length > 0 && (
        <div className="flex flex-col gap-2 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {rest.map((entry) => {
            const league = getLeague(entry.points);
            const isMe = user?.username === entry.username;
            const medalEmoji = entry.rank <= 3 && page === 0 ? MEDAL[entry.rank - 1].emoji : null;
            return (
              <div key={entry.id}
                className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-150 hover:translate-x-1 shadow-sm"
                style={{ border: isMe ? '1.5px solid rgba(232,72,12,0.35)' : '1px solid rgba(20,20,20,0.08)', background: isMe ? '#FFF4EF' : 'white' }}>
                <div className="w-8 text-center shrink-0">
                  {medalEmoji
                    ? <span className="text-[18px]">{medalEmoji}</span>
                    : <span className="font-black text-[13px] text-[#141414]/35">#{entry.rank}</span>}
                </div>
                <Avatar entry={entry} size={38} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-black text-[#141414] text-[13px] m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                      {entry.firstName ? `${entry.firstName} ${entry.lastName || ''}`.trim() : entry.username}
                    </p>
                    {isMe && (
                      <span className="text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
                        style={{ background: '#E8480C' }}>You</span>
                    )}
                  </div>
                  <p className="text-[#141414]/40 font-normal text-[11px] m-0 mt-0.5">{league.icon} {league.name} · 🔥 {entry.streakLength}d</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-[15px] m-0" style={{ color: '#B45309' }}>{entry.points.toLocaleString()}</p>
                  <p className="text-[#141414]/30 font-normal text-[10px] m-0">XP</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!leaderboardLoading && !leaderboardError && entries.length === 0 && (
        <div className="text-center py-14 px-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <div className="text-[48px] mb-3">🏆</div>
          <p className="font-black text-[#141414] text-[16px] m-0 mb-1.5">No one here yet</p>
          <p className="font-normal text-[#141414]/45 text-[13px] m-0">Complete lessons to earn XP and appear on the leaderboard!</p>
        </div>
      )}

      {!leaderboardLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className={`bg-white rounded-xl px-[18px] py-2.5 font-medium text-[13px] text-[#141414] cursor-pointer transition-all active:scale-95 border ${page === 0 ? 'opacity-40 cursor-not-allowed border-black/8' : 'hover:bg-black/4 border-black/8'}`}>
            ← Prev
          </button>
          <div className="rounded-xl px-[18px] py-2.5 font-black text-[13px]"
            style={{ background: '#FEF8EF', border: '1px solid rgba(180,83,9,0.2)', color: '#B45309' }}>
            {page + 1} / {totalPages}
          </div>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
            className={`bg-white rounded-xl px-[18px] py-2.5 font-medium text-[13px] text-[#141414] cursor-pointer transition-all active:scale-95 border ${page >= totalPages - 1 ? 'opacity-40 cursor-not-allowed border-black/8' : 'hover:bg-black/4 border-black/8'}`}>
            Next →
          </button>
        </div>
      )}
    </PageShell>
  );
};

export default LeaderboardPage;