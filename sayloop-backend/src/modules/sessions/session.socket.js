/**
 * SayLoop — Session Socket Handler (Server-Authoritative)
 *
 * Design principles:
 *  1. Server is ALWAYS the source of truth for timer. Never trust client.
 *  2. Mic tracking uses timestamps, not counters — prevents desync.
 *  3. session:end fires ONCE only (guarded by session.ended flag).
 *  4. XP calculated server-side, never client-side.
 *  5. Disconnect is treated as resign.
 */

const matchesService = require('../match/match.service');
const { calculateXP, applyXP } = require('./xpService');
const {
  SESSION_DURATION,
  MIC_OFF_LIMIT,
  WARNING_BEFORE_RESIGN,
} = require('../../config/sessionConfig');

// ─── In-memory maps ───────────────────────────────────────────────────────────
// socketId → sessionId
const socketRooms = new Map();

// topic → [{ userId, socketId, timestamp }]
const queue = new Map();

/**
 * sessionState shape:
 * {
 *   [sessionId]: {
 *     ended: boolean,
 *     timerInterval: NodeJS.Timeout,
 *     startedAt: number,       // ms timestamp
 *     endsAt: number,          // ms timestamp
 *     users: {
 *       [userId]: {
 *         socketId: string,
 *         speakingTime: number,    // seconds (server-capped at 1/tick)
 *         micOffStart: number|null, // timestamp when mic went OFF (null = mic ON)
 *         lastMicOnAt: number,     // timestamp of last mic ON event
 *         inactive: boolean,
 *         resigned: boolean,
 *         warningInterval: NodeJS.Timeout|null,
 *       }
 *     }
 *   }
 * }
 */
const sessionState = new Map();

// ─── Queue helpers ────────────────────────────────────────────────────────────
function enqueue(topic, entry) {
  if (!queue.has(topic)) queue.set(topic, []);
  queue.set(topic, queue.get(topic).filter((e) => e.userId !== entry.userId));
  queue.get(topic).push(entry);
}

function dequeue(topic, userId) {
  if (!queue.has(topic)) return;
  queue.set(topic, queue.get(topic).filter((e) => e.userId !== userId));
}

function findOpponent(topic, userId) {
  return (queue.get(topic) ?? []).find((e) => e.userId !== userId) ?? null;
}

/** Allow other modules (e.g. match.socket) to register a socket → room mapping */
function setSocketRoom(socketId, sessionId) {
  socketRooms.set(socketId, sessionId);
}

// ─── Session lifecycle helpers ───────────────────────────────────────────────

function createSessionState(sessionId, userId1, socketId1, userId2, socketId2) {
  const now = Date.now();
  sessionState.set(sessionId, {
    ended: false,
    timerInterval: null,
    warningIntervals: {},
    startedAt: now,
    endsAt: now + SESSION_DURATION * 1000,
    users: {
      [userId1]: {
        socketId: socketId1,
        speakingTime: 0,
        micOffStart: null,
        lastMicOnAt: now,
        inactive: false,
        resigned: false,
        warningInterval: null,
      },
      [userId2]: {
        socketId: socketId2,
        speakingTime: 0,
        micOffStart: null,
        lastMicOnAt: now,
        inactive: false,
        resigned: false,
        warningInterval: null,
      },
    },
  });
}

/**
 * Public entry: initialise session state + start timer for a given room.
 * Idempotent — returns false (and does nothing) if session already exists.
 * Used by match.socket.js when BOTH users have joined via match:join-session.
 */
function initSessionForRoom(io, sessionId, userId1, socketId1, userId2, socketId2) {
  if (sessionState.has(sessionId)) return false; // already running
  createSessionState(sessionId, userId1, socketId1, userId2, socketId2);
  // Emit session:start to the room
  io.to(sessionId).emit('session:start', {
    sessionId,
    durationSeconds: SESSION_DURATION,
    startedAt: sessionState.get(sessionId).startedAt,
  });
  startTimer(io, sessionId);
  return true;
}

/**
 * End a session exactly once.
 * Calculates XP, persists to DB, emits session:end to both users.
 */
async function endSession(io, sessionId, { resignedUserId = null } = {}) {
  const sess = sessionState.get(sessionId);
  if (!sess || sess.ended) return; // double-emit protection
  sess.ended = true;

  // Stop timer
  if (sess.timerInterval) { clearInterval(sess.timerInterval); sess.timerInterval = null; }

  // Stop any mic warning intervals
  for (const uid of Object.keys(sess.users)) {
    const u = sess.users[uid];
    if (u.warningInterval) { clearInterval(u.warningInterval); u.warningInterval = null; }
    if (resignedUserId && Number(uid) === resignedUserId) {
      u.resigned = true;
      u.inactive = true;
    }
  }

  const userIds = Object.keys(sess.users).map(Number);
  const [u1id, u2id] = userIds;
  const u1 = sess.users[u1id];
  const u2 = sess.users[u2id];

  const sessionDuration = Math.floor((Date.now() - sess.startedAt) / 1000);

  const { xp1, xp2, breakdown1, breakdown2 } = calculateXP(
    { id: u1id, speakingTime: u1.speakingTime, inactive: u1.inactive, resigned: u1.resigned },
    { id: u2id, speakingTime: u2.speakingTime, inactive: u2.inactive, resigned: u2.resigned },
    sessionDuration,
  );

  // Persist XP (fire-and-forget, log errors)
  applyXP(u1id, u2id, xp1, xp2).catch((err) =>
    console.error('[XP] Failed to persist XP:', err.message)
  );

  // Emit tailored session:end to each user
  const emitEnd = (userId, xpEarned, breakdown) => {
    const ud = sess.users[userId];
    if (!ud) return;
    io.to(ud.socketId).emit('session:end', {
      sessionDuration,
      xpEarned,
      breakdown,
      speakingTime: ud.speakingTime,
      resigned: ud.resigned,
    });
  };

  emitEnd(u1id, xp1, breakdown1);
  emitEnd(u2id, xp2, breakdown2);

  console.log(`[Session] Ended sessionId=${sessionId} xp1=${xp1} xp2=${xp2} duration=${sessionDuration}s`);

  // Clean up after a short delay (allow clients to receive the event)
  setTimeout(() => sessionState.delete(sessionId), 5000);
}

/**
 * Start the server-authoritative 1-second countdown for a session.
 */
function startTimer(io, sessionId) {
  const sess = sessionState.get(sessionId);
  if (!sess) return;

  sess.timerInterval = setInterval(async () => {
    const s = sessionState.get(sessionId);
    if (!s || s.ended) return;

    const secondsLeft = Math.max(0, Math.floor((s.endsAt - Date.now()) / 1000));
    io.to(sessionId).emit('timer:update', { secondsLeft });

    if (secondsLeft === 0) {
      await endSession(io, sessionId);
    }
  }, 1000);
}

/**
 * Handle mic-off tracking for a user.
 * Uses timestamps to avoid desync. Warning emitted at MIC_OFF_LIMIT - WARNING_BEFORE_RESIGN.
 */
function handleMicOff(io, sessionId, userId) {
  const sess = sessionState.get(sessionId);
  if (!sess || sess.ended) return;
  const user = sess.users[userId];
  if (!user || user.resigned) return;

  // Record when mic went off
  user.micOffStart = Date.now();
  user.lastMicOnAt = null;

  // Clear any previous warning interval
  if (user.warningInterval) { clearInterval(user.warningInterval); user.warningInterval = null; }

  // Poll every second to check mic duration
  user.warningInterval = setInterval(async () => {
    const s = sessionState.get(sessionId);
    if (!s || s.ended) { clearInterval(user.warningInterval); return; }
    const u = s.users[userId];
    if (!u || u.micOffStart === null) { clearInterval(u.warningInterval); u.warningInterval = null; return; }

    const micOffDuration = (Date.now() - u.micOffStart) / 1000;

    // Emit warning when in the danger zone
    const warningStart = MIC_OFF_LIMIT - WARNING_BEFORE_RESIGN;
    if (micOffDuration >= warningStart && micOffDuration < MIC_OFF_LIMIT) {
      const secondsLeft = Math.ceil(MIC_OFF_LIMIT - micOffDuration);
      io.to(u.socketId).emit('mic:warning', { secondsLeft });
    }

    // Auto-resign if limit hit
    if (micOffDuration >= MIC_OFF_LIMIT) {
      clearInterval(u.warningInterval);
      u.warningInterval = null;
      console.log(`[Session] Auto-resign userId=${userId} (mic off ${micOffDuration.toFixed(1)}s)`);
      u.inactive = true;
      u.resigned = true;

      io.to(u.socketId).emit('user:resigned', { reason: 'mic_inactive' });
      io.to(sessionId).emit('user:resigned', { userId, reason: 'mic_inactive' });
      await endSession(io, sessionId, { resignedUserId: userId });
    }
  }, 1000);
}

// ─── Main socket registration ─────────────────────────────────────────────────
function registerSessionHandlers(io) {
  io.on('connection', (socket) => {
    const userId = socket.dbUserId;
    console.log(`[Socket] Connected — dbUserId:${userId} socketId:${socket.id}`);

    // ── Helper: emit to everyone else in session room ──────────────────────
    const emitToRoom = (event, data) => {
      const room = socketRooms.get(socket.id);
      if (room) socket.to(room).emit(event, data);
    };

    const getSession = () => {
      const room = socketRooms.get(socket.id);
      return room ? sessionState.get(room) : null;
    };

    // ── find-partner ───────────────────────────────────────────────────────
    socket.on('find-partner', async ({ topic }) => {
      const opponent = findOpponent(topic, userId);

      if (opponent) {
        dequeue(topic, userId);
        dequeue(topic, opponent.userId);

        let sessionId;
        try {
          const matchRecord = await matchesService.requestMatch({
            userId,
            partnerId: opponent.userId,
            topic,
          });
          const accepted = await matchesService.acceptMatch(matchRecord.id, opponent.userId);
          sessionId = accepted.sessionId;
        } catch (err) {
          console.error('[Socket] Match DB error:', err.message);
          sessionId = `session_${Date.now()}`;
        }

        socket.join(sessionId);
        const opponentSocket = io.sockets.sockets.get(opponent.socketId);
        if (opponentSocket) opponentSocket.join(sessionId);
        socketRooms.set(socket.id, sessionId);
        socketRooms.set(opponent.socketId, sessionId);

        // Initialise server-side session tracking
        createSessionState(sessionId, userId, socket.id, opponent.userId, opponent.socketId);

        // Emit matched to both
        socket.emit('matched', {
          sessionId, isInitiator: true,
          partner: { userId: opponent.userId, socketId: opponent.socketId, username: null, firstName: null, pfpSource: null },
        });
        io.to(opponent.socketId).emit('matched', {
          sessionId, isInitiator: false,
          partner: { userId, socketId: socket.id, username: null, firstName: null, pfpSource: null },
        });

        // Emit session:start then begin countdown
        io.to(sessionId).emit('session:start', {
          sessionId,
          durationSeconds: SESSION_DURATION,
          startedAt: sessionState.get(sessionId).startedAt,
        });
        startTimer(io, sessionId);

        console.log(`[Session] Started sessionId=${sessionId} between ${userId} and ${opponent.userId}`);
      } else {
        enqueue(topic, { userId, socketId: socket.id, timestamp: Date.now() });
        socket.emit('waiting', `Looking for a ${topic} partner...`);
      }
    });

    // ── WebRTC signalling ──────────────────────────────────────────────────
    socket.on('offer', ({ offer, to }) => io.to(to).emit('offer', { offer, from: socket.id }));
    socket.on('answer', ({ answer, to }) => io.to(to).emit('answer', { answer }));
    socket.on('ice-candidate', ({ candidate, to }) => io.to(to).emit('ice-candidate', { candidate }));

    // ── Chat & debate ──────────────────────────────────────────────────────
    socket.on('chat-message', (data) => emitToRoom('chat-message', data));
    socket.on('debate-argument', (data) => emitToRoom('debate-argument', data));

    // ── Draw ───────────────────────────────────────────────────────────────
    socket.on('offer-draw', () => emitToRoom('draw-received'));
    socket.on('accept-draw', () => emitToRoom('draw-accepted', { xpEarned: 15 }));
    socket.on('decline-draw', () => emitToRoom('draw-declined'));

    // ── Resign (manual) ───────────────────────────────────────────────────
    socket.on('resign', async () => {
      const room = socketRooms.get(socket.id);
      console.log(`[Session] Resign received from userId=${userId} room=${room}`);
      if (!room) {
        console.warn('[Session] Resign: no room found for socket', socket.id);
        return;
      }
      const sess = sessionState.get(room);
      if (!sess) {
        console.warn('[Session] Resign: no session state for room', room);
        return;
      }
      if (sess.ended) return;
      if (sess.users[userId]) {
        sess.users[userId].resigned = true;
        sess.users[userId].inactive = true;
      }
      console.log(`[Session] ✅ Processing resign for userId=${userId}`);
      socket.to(room).emit('opponent-resigned', { winnerId: null, xpEarned: 30 });
      await endSession(io, room, { resignedUserId: userId });
    });

    // ── Mic status ─────────────────────────────────────────────────────────
    socket.on('mic:status', ({ isOn }) => {
      const room = socketRooms.get(socket.id);
      if (!room) return;
      const sess = sessionState.get(room);
      if (!sess || sess.ended) return;
      const user = sess.users[userId];
      if (!user) return;

      console.log(`[Session] mic:status userId=${userId} isOn=${isOn}`);

      if (isOn) {
        user.micOffStart = null;
        user.lastMicOnAt = Date.now();
        if (user.warningInterval) { clearInterval(user.warningInterval); user.warningInterval = null; }
        socket.emit('mic:warning:cleared');
      } else {
        if (user.micOffStart === null) {
          handleMicOff(io, room, userId);
        }
      }
    });

    // ── Speaking tick ──────────────────────────────────────────────────────
    socket.on('speaking:tick', () => {
      const room = socketRooms.get(socket.id);
      if (!room) return;
      const sess = sessionState.get(room);
      if (!sess || sess.ended) return;
      const user = sess.users[userId];
      if (!user || user.resigned) return;
      if (user.micOffStart !== null) return;
      if (user.speakingTime < SESSION_DURATION) {
        user.speakingTime += 1;
      }
    });

    // ── Leave / disconnect ────────────────────────────────────────────────
    const handleLeave = async (reason) => {
      queue.forEach((_, topic) => dequeue(topic, userId));
      const room = socketRooms.get(socket.id);
      if (room) {
        const sess = sessionState.get(room);
        if (sess && !sess.ended) {
          // Treat disconnect as resign
          if (sess.users[userId]) {
            sess.users[userId].resigned = true;
            sess.users[userId].inactive = true;
          }
          emitToRoom('partner-disconnected');
          await endSession(io, room, { resignedUserId: userId });
        }
        socket.leave(room);
      }
      socketRooms.delete(socket.id);
      console.log(`[Socket] ${reason} — userId:${userId} socketId:${socket.id}`);
    };

    socket.on('leave-session', () => handleLeave('leave-session'));
    socket.on('disconnect', () => handleLeave('disconnect'));
  });
}

module.exports = { registerSessionHandlers, setSocketRoom, initSessionForRoom };