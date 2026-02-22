import React, { useEffect, useState } from 'react';
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
  if (points >= 5000)  return { name: 'Gold',    color: '#f59e0b', icon: '🥇' };
  if (points >= 2000)  return { name: 'Silver',  color: '#9ca3af', icon: '🥈' };
  if (points >= 500)   return { name: 'Bronze',  color: '#f97316', icon: '🥉' };
  return                      { name: 'Rookie',  color: '#a3e635', icon: '🌱' };
};

const AVATAR_COLORS = ['#fbbf24', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const Avatar = ({ entry, size = 40 }: { entry: LeaderboardEntry; size?: number }) => {
  const initial = (entry.firstName?.[0] || entry.username?.[0] || '?').toUpperCase();
  const color = AVATAR_COLORS[entry.id % AVATAR_COLORS.length];
  return entry.pfpSource
    ? <img src={entry.pfpSource} alt={entry.username}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fef3c7' }} />
    : <div style={{
        width: size, height: size, borderRadius: '50%', background: color, border: '2px solid #fef3c7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: size * 0.38, color: '#fff', flexShrink: 0
      }}>{initial}</div>;
};

const MEDAL = [
  { bg: '#fef3c7', border: '#fbbf24', emoji: '🥇' },
  { bg: '#f3f4f6', border: '#9ca3af', emoji: '🥈' },
  { bg: '#fff7ed', border: '#f97316', emoji: '🥉' },
];

const PodiumCard = ({ entry, height, crown }: { entry: LeaderboardEntry; height: number; crown?: boolean }) => {
  const m = MEDAL[entry.rank - 1];
  return (
    <div style={{ flex: 1, maxWidth: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', animation: 'pop .5s ease both' }}>
      {crown && <span style={{ fontSize: '20px' }}>👑</span>}
      <Avatar entry={entry} size={crown ? 52 : 42} />
      <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '11px', margin: 0, textAlign: 'center', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {entry.firstName || entry.username}
      </p>
      <p style={{ fontWeight: 800, color: '#f59e0b', fontSize: '12px', margin: 0 }}>{entry.points.toLocaleString()} XP</p>
      <div style={{ width: '100%', height, background: `linear-gradient(180deg,${m.bg},#fff)`, border: `2px solid ${m.border}`, borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
        {m.emoji}
      </div>
    </div>
  );
};

const SkeletonRow = () => (
  <div style={{ height: '62px', borderRadius: '16px', background: 'linear-gradient(90deg,#f3f4f6 25%,#fef9f0 50%,#f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
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
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pop     { 0%{transform:scale(.85);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        .anim-1 { animation: fadeUp .4s ease both; }
        .anim-2 { animation: fadeUp .4s .07s ease both; }
        .anim-3 { animation: fadeUp .4s .14s ease both; }
        .anim-4 { animation: fadeUp .4s .21s ease both; }
        .lb-row:hover { transform: translateX(4px); }
      `}</style>

      {/* Header */}
      <div className="anim-1" style={{ marginBottom: '20px' }}>
        <p style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 700, margin: '0 0 2px' }}>This week</p>
        <h1 style={{ fontSize: 'clamp(22px,5vw,30px)', fontWeight: 900, color: '#1a1a26', margin: 0 }}>Leaderboard 🏆</h1>
      </div>

      {/* Your rank banner */}
      {userRank && (
        <div className="anim-2" style={{ background: 'linear-gradient(135deg,#1a1a26,#2d2d3d)', borderRadius: '20px', padding: '16px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle,#fde68a,transparent 65%)', opacity: 0.18 }} />
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg,#fbbf24,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px', color: '#fff', flexShrink: 0 }}>
            #{userRank.rank}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#fffbf5', fontWeight: 900, fontSize: '14px', margin: '0 0 2px' }}>Your rank</p>
            <p style={{ color: '#9ca3af', fontWeight: 600, fontSize: '12px', margin: 0 }}>
              {getLeague(userRank.points).icon} {getLeague(userRank.points).name} League · 🔥 {userRank.streakLength}d streak
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ color: '#f59e0b', fontWeight: 900, fontSize: '18px', margin: 0 }}>{userRank.points.toLocaleString()}</p>
            <p style={{ color: '#6b7280', fontWeight: 700, fontSize: '11px', margin: 0 }}>XP</p>
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {leaderboardLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {/* Error */}
      {leaderboardError && !leaderboardLoading && (
        <div style={{ background: '#fef2f2', border: '2px solid #fecaca', borderRadius: '18px', padding: '24px', textAlign: 'center' }}>
          <p style={{ color: '#dc2626', fontWeight: 800, fontSize: '14px', margin: '0 0 12px' }}>Failed to load leaderboard</p>
          <button onClick={() => dispatch(fetchLeaderboardRequest({ page, limit: LIMIT }))}
            style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)', color: '#fff', fontWeight: 800, fontSize: '13px', padding: '10px 22px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
            Try again
          </button>
        </div>
      )}

      {/* Podium — top 3 */}
      {!leaderboardLoading && !leaderboardError && top3.length === 3 && (
        <div className="anim-3" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
            <PodiumCard entry={top3[1]} height={90} />
            <PodiumCard entry={top3[0]} height={120} crown />
            <PodiumCard entry={top3[2]} height={72} />
          </div>
        </div>
      )}

      {/* Ranked rows */}
      {!leaderboardLoading && !leaderboardError && rest.length > 0 && (
        <div className="anim-4" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {rest.map((entry) => {
            const league = getLeague(entry.points);
            const isMe = user?.username === entry.username;
            const medal = entry.rank <= 3 && page === 0 ? MEDAL[entry.rank - 1].emoji : null;
            return (
              <div key={entry.id} className="lb-row" style={{ background: isMe ? '#fef9f0' : '#fff', border: `2px solid ${isMe ? '#fcd34d' : '#fef3c7'}`, borderRadius: '16px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'transform .15s' }}>
                <div style={{ width: '32px', textAlign: 'center', flexShrink: 0 }}>
                  {medal ? <span style={{ fontSize: '18px' }}>{medal}</span> : <span style={{ fontWeight: 900, fontSize: '13px', color: '#9ca3af' }}>#{entry.rank}</span>}
                </div>
                <Avatar entry={entry} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '13px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.firstName ? `${entry.firstName} ${entry.lastName || ''}`.trim() : entry.username}
                    </p>
                    {isMe && <span style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)', color: '#fff', fontSize: '9px', fontWeight: 900, padding: '2px 7px', borderRadius: '999px' }}>YOU</span>}
                  </div>
                  <p style={{ color: '#9ca3af', fontWeight: 600, fontSize: '11px', margin: '1px 0 0' }}>{league.icon} {league.name} · 🔥 {entry.streakLength}d</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontWeight: 900, color: '#f59e0b', fontSize: '15px', margin: 0 }}>{entry.points.toLocaleString()}</p>
                  <p style={{ fontWeight: 600, color: '#9ca3af', fontSize: '10px', margin: 0 }}>XP</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!leaderboardLoading && !leaderboardError && entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '56px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
          <p style={{ fontWeight: 900, color: '#1a1a26', fontSize: '16px', margin: '0 0 6px' }}>No one here yet</p>
          <p style={{ fontWeight: 600, color: '#9ca3af', fontSize: '13px', margin: 0 }}>Complete lessons to earn XP and appear on the leaderboard!</p>
        </div>
      )}

      {/* Pagination */}
      {!leaderboardLoading && totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '12px', padding: '10px 18px', fontWeight: 800, fontSize: '13px', color: '#1a1a26', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1, fontFamily: 'Nunito,sans-serif' }}>
            ← Prev
          </button>
          <div style={{ background: '#fef3c7', border: '2px solid #fcd34d', borderRadius: '12px', padding: '10px 18px', fontWeight: 900, fontSize: '13px', color: '#d97706' }}>
            {page + 1} / {totalPages}
          </div>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
            style={{ background: '#fff', border: '2px solid #fef3c7', borderRadius: '12px', padding: '10px 18px', fontWeight: 800, fontSize: '13px', color: '#1a1a26', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1, fontFamily: 'Nunito,sans-serif' }}>
            Next →
          </button>
        </div>
      )}
    </PageShell>
  );
};

export default LeaderboardPage;