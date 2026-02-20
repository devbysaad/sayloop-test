const { Server } = require('socket.io');
const prisma = require('../../config/database');

// ── In-memory state ─────────────────────────────────────────────
let waitingUsers = [];   // [{ socketId, userId, topic }]
const connections = {};   // { socketId: partnerSocketId }
const userSockets = {};   // { userId: socketId }
const roomData = {};   // { roomId: { user1, user2, topic, startedAt, drawOfferedBy } }

let io;

// ── XP constants ─────────────────────────────────────────────────
const XP = {
  WIN: 30,
  DRAW: 15,
  PARTICIPATE: 10,
  RESIGN_LOSS: 0,   // resigner gets nothing
};

// ── helpers ──────────────────────────────────────────────────────
const awardXP = async (userId, amount) => {
  if (!userId || amount <= 0) return;
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: amount } },
    });
  } catch (err) {
    console.error(`Failed to award XP to user ${userId}:`, err.message);
  }
};

const closeRoom = (roomId) => {
  if (roomData[roomId]) delete roomData[roomId];
};

const cleanupConnection = (socketId) => {
  const partnerId = connections[socketId];
  delete connections[socketId];
  if (partnerId) delete connections[partnerId];
  return partnerId;
};

// ── main init ────────────────────────────────────────────────────
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ── AUTH ──────────────────────────────────────────────────────
    socket.on('authenticate', ({ userId }) => {
      if (!userId) return;
      userSockets[userId] = socket.id;
      socket.data.userId = userId;
      console.log(`✓ User ${userId} authenticated → socket ${socket.id}`);
    });

    // ── MATCHMAKING ───────────────────────────────────────────────
    socket.on('find-partner', ({ userId, topic }) => {
      socket.data.userId = userId;
      socket.data.topic = topic;

      const matchIndex = waitingUsers.findIndex(
        (w) => w.topic === topic && w.socketId !== socket.id
      );

      if (matchIndex !== -1) {
        const partner = waitingUsers[matchIndex];
        waitingUsers.splice(matchIndex, 1);
        const partnerSocket = io.sockets.sockets.get(partner.socketId);

        if (partnerSocket) {
          const roomId = `room_${socket.id}_${partner.socketId}_${Date.now()}`;

          connections[socket.id] = partner.socketId;
          connections[partner.socketId] = socket.id;

          roomData[roomId] = {
            user1: userId,
            user2: partner.userId,
            topic,
            startedAt: new Date(),
            drawOfferedBy: null,   // tracks who offered draw
          };

          socket.join(roomId);
          partnerSocket.join(roomId);
          socket.data.roomId = roomId;
          partnerSocket.data.roomId = roomId;

          socket.emit('partner-found', {
            partnerId: partner.socketId,
            partnerUserId: partner.userId,
            roomId,
            isInitiator: true,
            topic,
          });
          partnerSocket.emit('partner-found', {
            partnerId: socket.id,
            partnerUserId: userId,
            roomId,
            isInitiator: false,
            topic,
          });

          console.log(`✓ Matched ${userId} ↔ ${partner.userId} in ${roomId}`);
        } else {
          waitingUsers.push({ socketId: socket.id, userId, topic });
          socket.emit('waiting', { message: 'Looking for a partner…' });
        }
      } else {
        waitingUsers.push({ socketId: socket.id, userId, topic });
        socket.emit('waiting', { message: 'Looking for a partner…' });
        console.log(`⏳ User ${userId} waiting for topic: ${topic}`);
      }
    });

    // ── WEBRTC SIGNALING ──────────────────────────────────────────
    socket.on('offer', ({ offer, to }) => socket.to(to).emit('offer', { offer, from: socket.id }));
    socket.on('answer', ({ answer, to }) => socket.to(to).emit('answer', { answer, from: socket.id }));
    socket.on('ice-candidate', ({ candidate, to }) => socket.to(to).emit('ice-candidate', { candidate, from: socket.id }));

    // ── CHAT ──────────────────────────────────────────────────────
    socket.on('send-message', ({ message, roomId }) => {
      if (!roomData[roomId]) return;
      io.to(roomId).emit('receive-message', {
        from: socket.id,
        userId: socket.data.userId,
        message,
        timestamp: new Date(),
      });
    });

    // ── DEBATE ARGUMENT ───────────────────────────────────────────
    socket.on('submit-argument', ({ argument, roomId }) => {
      if (!roomData[roomId]) return;
      io.to(roomId).emit('argument-received', {
        from: socket.data.userId,
        argument,
        timestamp: new Date(),
      });
    });

    // ────────────────────────────────────────────────────────────
    // DRAW SYSTEM
    // Flow:
    //   User A  → emit 'offer-draw'
    //   Server  → forward to User B as 'draw-offered'
    //   User B  → emit 'accept-draw' or 'decline-draw'
    //   Server  → if accepted: end session, award draw XP to both
    //             if declined: notify User A, match continues
    // ────────────────────────────────────────────────────────────

    socket.on('offer-draw', ({ roomId }) => {
      const room = roomData[roomId];
      if (!room) return;

      // Only allow one outstanding draw offer at a time
      if (room.drawOfferedBy) {
        socket.emit('draw-already-offered', {
          message: 'A draw has already been offered. Wait for your partner to respond.',
        });
        return;
      }

      room.drawOfferedBy = socket.data.userId;

      const partnerId = connections[socket.id];
      if (partnerId) {
        io.to(partnerId).emit('draw-offered', {
          offeredBy: socket.data.userId,
          message: 'Your partner is offering a draw. Accept or decline?',
        });
        // Confirm to the offering user
        socket.emit('draw-offer-sent', {
          message: 'Draw offered. Waiting for partner to respond…',
        });
        console.log(`🤝 User ${socket.data.userId} offered draw in ${roomId}`);
      }
    });

    socket.on('accept-draw', async ({ roomId }) => {
      const room = roomData[roomId];
      if (!room) return;

      const { user1, user2 } = room;
      console.log(`✅ Draw accepted in ${roomId} — awarding ${XP.DRAW} XP each`);

      // Award draw XP to both players
      await Promise.all([
        awardXP(user1, XP.DRAW),
        awardXP(user2, XP.DRAW),
      ]);

      // Notify both players
      io.to(roomId).emit('debate-ended', {
        roomId,
        outcome: 'draw',
        xpAwarded: XP.DRAW,
        endedAt: new Date(),
        message: 'Draw agreed. Both players earned 15 XP.',
      });

      closeRoom(roomId);
      cleanupConnection(socket.id);
      console.log(`✓ Room ${roomId} closed — draw`);
    });

    socket.on('decline-draw', ({ roomId }) => {
      const room = roomData[roomId];
      if (!room) return;

      room.drawOfferedBy = null; // reset so another draw can be offered later

      const partnerId = connections[socket.id];
      if (partnerId) {
        // Notify the person who offered that it was declined
        io.to(partnerId).emit('draw-declined', {
          message: 'Your draw offer was declined. The match continues.',
        });
      }
      // Confirm to the declining user
      socket.emit('draw-declined-confirmed', {
        message: 'Draw declined. Match continues.',
      });

      console.log(`❌ Draw declined in ${roomId}`);
    });

    // ────────────────────────────────────────────────────────────
    // RESIGN SYSTEM
    // Like chess: the resigning player loses (0 XP), opponent wins (30 XP)
    // ────────────────────────────────────────────────────────────

    socket.on('resign', async ({ roomId }) => {
      const room = roomData[roomId];
      if (!room) return;

      const resigningUserId = socket.data.userId;
      const winnerUserId = room.user1 === resigningUserId ? room.user2 : room.user1;

      console.log(`🏳️ User ${resigningUserId} resigned in ${roomId}. Winner: ${winnerUserId}`);

      // Resigner gets 0 XP, winner gets 30 XP
      await Promise.all([
        awardXP(winnerUserId, XP.WIN),
        // resigner gets 0 — no DB call needed
      ]);

      // Notify both
      io.to(roomId).emit('debate-ended', {
        roomId,
        outcome: 'resign',
        resignedBy: resigningUserId,
        winnerId: winnerUserId,
        xpAwarded: {
          [winnerUserId]: XP.WIN,
          [resigningUserId]: XP.RESIGN_LOSS,
        },
        endedAt: new Date(),
        message: `Player resigned. Winner earns ${XP.WIN} XP.`,
      });

      closeRoom(roomId);
      cleanupConnection(socket.id);
      console.log(`✓ Room ${roomId} closed — resign`);
    });

    // ── END DEBATE (mutual / time-based) ──────────────────────────
    socket.on('end-debate', async ({ roomId }) => {
      const room = roomData[roomId];
      if (!room) return;

      const { user1, user2 } = room;
      await Promise.all([
        awardXP(user1, XP.PARTICIPATE),
        awardXP(user2, XP.PARTICIPATE),
      ]);

      io.to(roomId).emit('debate-ended', {
        roomId,
        outcome: 'completed',
        xpAwarded: XP.PARTICIPATE,
        endedAt: new Date(),
        message: 'Debate completed. Both players earned 10 XP.',
      });

      closeRoom(roomId);
      cleanupConnection(socket.id);
      console.log(`✓ Room ${roomId} closed — completed`);
    });

    // ── DISCONNECT ────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);

      waitingUsers = waitingUsers.filter((w) => w.socketId !== socket.id);
      if (socket.data.userId) delete userSockets[socket.data.userId];

      const roomId = socket.data.roomId;
      const room = roomId ? roomData[roomId] : null;

      if (room) {
        // Treat disconnect like resign — winner gets XP
        const disconnectingUserId = socket.data.userId;
        const winnerUserId = room.user1 === disconnectingUserId ? room.user2 : room.user1;
        await awardXP(winnerUserId, XP.WIN);
        closeRoom(roomId);
      }

      const partnerId = connections[socket.id];
      const partnerSocket = partnerId ? io.sockets.sockets.get(partnerId) : null;
      if (partnerSocket) {
        partnerSocket.emit('partner-disconnected', {
          message: 'Your partner disconnected. You win this round.',
          outcome: 'opponent_disconnected',
          xpAwarded: XP.WIN,
        });
        delete connections[partnerId];
      }
      delete connections[socket.id];
    });
  });

  console.log('✓ Socket.io initialized');
  return io;
};

const getIO = () => { if (!io) throw new Error('Socket.io not initialized'); return io; };
const emitToUser = (userId, event, data) => {
  const socketId = userSockets[userId];
  if (socketId) io.to(socketId).emit(event, data);
};

module.exports = { initSocket, getIO, emitToUser };