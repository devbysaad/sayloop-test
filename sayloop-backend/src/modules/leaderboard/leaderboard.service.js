const prisma = require('../../config/database');

// ─────────────────────────────────────────────────────────────────────────────
// Paginated leaderboard — all users ranked by points DESC
// ─────────────────────────────────────────────────────────────────────────────
const getPaginatedLeaderBoard = async (page = 0, limit = 20) => {
  const skip = page * limit;

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: [{ points: 'desc' }, { id: 'asc' }],
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        pfpSource: true,
        points: true,
        streakLength: true,
      },
    }),
    prisma.user.count(),
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: users.map((user, index) => ({
      rank: skip + index + 1,
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      pfpSource: user.pfpSource,
      points: user.points,
      streakLength: user.streakLength,
    })),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Top 10 leaderboard
// ─────────────────────────────────────────────────────────────────────────────
const getTopLeaderboard = async () => {
  return getPaginatedLeaderBoard(0, 10);
};

// ─────────────────────────────────────────────────────────────────────────────
// Single user rank — count users with more points, that + 1 = rank
// ─────────────────────────────────────────────────────────────────────────────
const getUserRank = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, points: true, streakLength: true, pfpSource: true },
  });

  if (!user) throw new Error('User not found');

  const usersAbove = await prisma.user.count({
    where: { points: { gt: user.points } },
  });

  return {
    rank: usersAbove + 1,
    id: user.id,
    username: user.username,
    points: user.points,
    streakLength: user.streakLength,
    pfpSource: user.pfpSource,
  };
};

module.exports = {
  getPaginatedLeaderBoard,
  getTopLeaderboard,
  getUserRank,
};