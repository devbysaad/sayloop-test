const prisma = require('../../config/database');

const MATCH_TTL_MS = 5 * 60 * 1000;

const matchesService = {

  async requestMatch({ userId, partnerId, topic }) {
    if (userId === partnerId) {
      throw Object.assign(new Error('Cannot match with yourself'), { status: 400 });
    }

    // FIX: verify both users exist BEFORE attempting insert.
    // Without this, Prisma throws a raw FK constraint error when either ID
    // is missing — which happens when the frontend sends mock/stale user IDs.
    const [requester, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId },    select: { id: true } }),
      prisma.user.findUnique({ where: { id: partnerId }, select: { id: true } }),
    ]);

    if (!requester) {
      throw Object.assign(new Error('Your user account was not found. Please refresh and try again.'), { status: 404 });
    }
    if (!receiver) {
      throw Object.assign(new Error('The selected partner was not found. They may have deleted their account.'), { status: 404 });
    }

    // Check for existing pending match between these users
    const existing = await prisma.match.findFirst({
      where: {
        status: 'PENDING',
        OR: [
          { requesterId: userId, receiverId: partnerId },
          { requesterId: partnerId, receiverId: userId },
        ],
      },
    });

    if (existing) {
      const age = Date.now() - existing.createdAt.getTime();
      if (age > MATCH_TTL_MS) {
        await prisma.match.update({ where: { id: existing.id }, data: { status: 'EXPIRED' } });
      } else {
        return existing;
      }
    }

    const match = await prisma.match.create({
      data: { requesterId: userId, receiverId: partnerId, topic, status: 'PENDING' },
    });

    return {
      matchId:   match.id,
      partnerId: match.receiverId,
      topic:     match.topic,
      status:    match.status.toLowerCase(),
    };
  },

  async acceptMatch(matchId, userId) {
    const match = await prisma.match.findUnique({ where: { id: matchId } });

    if (!match)                       throw Object.assign(new Error('Match not found'),            { status: 404 });
    if (match.receiverId !== userId)  throw Object.assign(new Error('Not authorised'),             { status: 403 });
    if (match.status !== 'PENDING')   throw Object.assign(new Error('Match is no longer pending'), { status: 409 });

    const age = Date.now() - match.createdAt.getTime();
    if (age > MATCH_TTL_MS) {
      await prisma.match.update({ where: { id: matchId }, data: { status: 'EXPIRED' } });
      throw Object.assign(new Error('Match request expired'), { status: 410 });
    }

    const sessionId = `session_${matchId}_${Date.now()}`;
    const updated = await prisma.match.update({
      where: { id: matchId },
      data:  { status: 'ACCEPTED', sessionId },
    });

    return {
      matchId:     updated.id,
      sessionId:   updated.sessionId,
      topic:       updated.topic,
      requesterId: updated.requesterId,
      receiverId:  updated.receiverId,
    };
  },

  async rejectMatch(matchId, userId) {
    const match = await prisma.match.findUnique({ where: { id: matchId } });

    if (!match)                       throw Object.assign(new Error('Match not found'),            { status: 404 });
    if (match.receiverId !== userId)  throw Object.assign(new Error('Not authorised'),             { status: 403 });
    if (match.status !== 'PENDING')   throw Object.assign(new Error('Match is no longer pending'), { status: 409 });

    await prisma.match.update({ where: { id: matchId }, data: { status: 'REJECTED' } });
    return { matchId, status: 'rejected' };
  },

  async getActiveMatches(userId) {
    const matches = await prisma.match.findMany({
      where: {
        status: { in: ['PENDING', 'ACCEPTED'] },
        OR: [{ requesterId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        requester: { select: { id: true, username: true, firstName: true, pfpSource: true, points: true } },
        receiver:  { select: { id: true, username: true, firstName: true, pfpSource: true, points: true } },
      },
    });

    return matches.map(m => ({ ...m, status: m.status.toLowerCase() }));
  },

  async getMatchHistory(userId, page = 0, limit = 20) {
    const skip  = page * limit;
    const where = {
      status: { in: ['COMPLETED', 'REJECTED', 'EXPIRED'] },
      OR: [{ requesterId: userId }, { receiverId: userId }],
    };

    const [total, matches] = await Promise.all([
      prisma.match.count({ where }),
      prisma.match.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { createdAt: 'desc' },
        include: {
          requester: { select: { id: true, username: true, firstName: true, pfpSource: true } },
          receiver:  { select: { id: true, username: true, firstName: true, pfpSource: true } },
        },
      }),
    ]);

    return {
      data:       matches.map(m => ({ ...m, status: m.status.toLowerCase() })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async completeMatch(sessionId) {
    const match = await prisma.match.findFirst({ where: { sessionId, status: 'ACCEPTED' } });
    if (!match) return null;
    return prisma.match.update({ where: { id: match.id }, data: { status: 'COMPLETED' } });
  },
};

module.exports = matchesService;