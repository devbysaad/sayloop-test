const prisma = require('../../config/database');
const { getLeagueByXP } = require('../../utils/league');

// Get public profile (visible to other users)
const getPublicProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, username: true, firstName: true, lastName: true,
      pfpSource: true, points: true, streakLength: true, createdAt: true,
      currentCourse: { select: { id: true, title: true, imageSrc: true } },
      _count: { select: { lessonCompletions: true, following: true, followers: true } },
    },
  });
  if (!user) throw new Error('User not found');

  return {
    ...user,
    league:          getLeagueByXP(user.points),
    lessonsCompleted: user._count.lessonCompletions,
    following:        user._count.following,
    followers:        user._count.followers,
  };
};

// Search profiles by username
const searchProfiles = async (query, limit = 10) => {
  if (!query || query.trim().length < 2) throw new Error('Search query must be at least 2 characters');

  return prisma.user.findMany({
    where: {
      username: { contains: query.trim(), mode: 'insensitive' },
    },
    select: {
      id: true, username: true, firstName: true, lastName: true,
      pfpSource: true, points: true, streakLength: true,
    },
    take: limit,
  });
};

// Get profile stats
const getProfileStats = async (userId) => {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { points: true, streakLength: true },
  });
  if (!user) throw new Error('User not found');

  const [lessonsCompleted, totalExercises, correctAnswers, rank] = await prisma.$transaction([
    prisma.lessonCompletion.count({ where: { userId } }),
    prisma.exerciseAttempt.count({ where: { userId } }),
    prisma.exerciseAttempt.count({ where: { userId, score: { gt: 0 } } }),
    prisma.user.count({ where: { points: { gt: user.points } } }),
  ]);

  const accuracy = totalExercises > 0 ? Math.round((correctAnswers / totalExercises) * 100) : 0;

  return {
    points:           user.points,
    streakLength:     user.streakLength,
    rank:             rank + 1,
    league:           getLeagueByXP(user.points),
    lessonsCompleted,
    totalExercises,
    correctAnswers,
    accuracy,
  };
};

module.exports = { getPublicProfile, searchProfiles, getProfileStats };
