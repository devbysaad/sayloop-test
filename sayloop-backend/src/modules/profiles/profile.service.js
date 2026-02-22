const prisma = require('../../config/database');
const { getLeagueByXP } = require('../../utils/league');

// ─────────────────────────────────────────────────────────────────────────────
// Public profile — safe fields only, visible to any authenticated user
// ─────────────────────────────────────────────────────────────────────────────
const getPublicProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id:           true,
      username:     true,
      firstName:    true,
      lastName:     true,
      pfpSource:    true,
      points:       true,
      streakLength: true,
      createdAt:    true,
      currentCourse: {
        select: { id: true, title: true, imageSrc: true },
      },
      _count: {
        select: {
          lessonCompletions: true,
          following:         true,
          followers:         true,
        },
      },
    },
  });

  if (!user) throw new Error('User not found');

  return {
    id:               user.id,
    username:         user.username,
    firstName:        user.firstName,
    lastName:         user.lastName,
    pfpSource:        user.pfpSource,
    points:           user.points,
    streakLength:     user.streakLength,
    createdAt:        user.createdAt,
    currentCourse:    user.currentCourse,
    league:           getLeagueByXP(user.points),
    lessonsCompleted: user._count.lessonCompletions,
    following:        user._count.following,
    followers:        user._count.followers,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Search profiles by username (min 2 chars, max 10 results)
// ─────────────────────────────────────────────────────────────────────────────
const searchProfiles = async (query, limit = 10) => {
  if (!query || query.trim().length < 2) {
    throw new Error('Search query must be at least 2 characters');
  }

  const users = await prisma.user.findMany({
    where: {
      username: { contains: query.trim(), mode: 'insensitive' },
    },
    select: {
      id:           true,
      username:     true,
      firstName:    true,
      lastName:     true,
      pfpSource:    true,
      points:       true,
      streakLength: true,
    },
    take: limit,
    orderBy: { points: 'desc' },
  });

  return users;
};

// ─────────────────────────────────────────────────────────────────────────────
// Profile stats — detailed metrics for the profile stats tab
// ─────────────────────────────────────────────────────────────────────────────
const getProfileStats = async (userId) => {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { points: true, streakLength: true },
  });

  if (!user) throw new Error('User not found');

  // All counts in one transaction for performance
  const [lessonsCompleted, totalExercises, correctAnswers, usersAbove] =
    await prisma.$transaction([
      prisma.lessonCompletion.count({
        where: { userId },
      }),
      prisma.exerciseAttempt.count({
        where: { userId },
      }),
      prisma.exerciseAttempt.count({
        where: { userId, score: { gt: 0 } },
      }),
      prisma.user.count({
        where: { points: { gt: user.points } },
      }),
    ]);

  const accuracy =
    totalExercises > 0
      ? Math.round((correctAnswers / totalExercises) * 100)
      : 0;

  return {
    points:           user.points,
    streakLength:     user.streakLength,
    rank:             usersAbove + 1,
    league:           getLeagueByXP(user.points),
    lessonsCompleted,
    totalExercises,
    correctAnswers,
    accuracy,
  };
};

module.exports = { getPublicProfile, searchProfiles, getProfileStats };