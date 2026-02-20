const { Server } = require('socket.io');

// ── In-memory state ───────────────────────────────────
let waitingUsers  = [];       // [{ socketId, userId, topic }]
const connections = {};       // { socketId: partnerSocketId }
const userSockets = {};       // { userId: socketId }
const roomData    = {};       // { roomId: { user1, user2, topic, startedAt } }

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
      methods:     ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ─────────────────────────────────────────────────
    // AUTH
    // Call this right after connecting on the frontend
    // socket.emit('authenticate', { userId: myDbUserId })
    // ─────────────────────────────────────────────────
    socket.on('authenticate', ({ userId }) => {
      if (!userId) return;
      userSockets[userId] = socket.id;
      socket.data.userId  = userId;
      console.log(`✓ User ${userId} authenticated → socket ${socket.id}`);
    });

    // ─────────────────────────────────────────────────
    // MATCHMAKING
    // Frontend: socket.emit('find-partner', { userId, topic })
    // ─────────────────────────────────────────────────
    socket.on('find-partner', ({ userId, topic }) => {
      socket.data.userId = userId;
      socket.data.topic  = topic;

      // Look for someone waiting with the same topic
      const matchIndex = waitingUsers.findIndex(
        (w) => w.topic === topic && w.socketId !== socket.id
      );

      if (matchIndex !== -1) {
        // ── Found a match ──────────────────────────
        const partner       = waitingUsers[matchIndex];
        waitingUsers.splice(matchIndex, 1);

        const partnerSocket = io.sockets.sockets.get(partner.socketId);

        if (partnerSocket) {
          const roomId = `room_${socket.id}_${partner.socketId}_${Date.now()}`;

          connections[socket.id]        = partner.socketId;
          connections[partner.socketId] = socket.id;

          roomData[roomId] = {
            user1:     userId,
            user2:     partner.userId,
            topic,
            startedAt: new Date(),
          };

          socket.join(roomId);
          partnerSocket.join(roomId);

          socket.data.roomId        = roomId;
          partnerSocket.data.roomId = roomId;

          // isInitiator = true  → this user sends the WebRTC offer first
          // isInitiator = false → this user waits for offer then sends answer
          socket.emit('partner-found', {
            partnerId:     partner.socketId,
            partnerUserId: partner.userId,
            roomId,
            isInitiator:   true,
            topic,
          });

          partnerSocket.emit('partner-found', {
            partnerId:     socket.id,
            partnerUserId: userId,
            roomId,
            isInitiator:   false,
            topic,
          });

          console.log(`✓ Matched ${userId} ↔ ${partner.userId} in ${roomId}`);
        } else {
          // Partner socket died — put current user in queue
          waitingUsers.push({ socketId: socket.id, userId, topic });
          socket.emit('waiting', { message: 'Looking for a partner...' });
        }
      } else {
        // ── No match yet — add to queue ─────────────
        waitingUsers.push({ socketId: socket.id, userId, topic });
        socket.emit('waiting', { message: 'Looking for a partner...' });
        console.log(`⏳ User ${userId} waiting for topic: ${topic}`);
      }
    });

    // ─────────────────────────────────────────────────
    // WEBRTC SIGNALING
    // These 3 events just relay data between the two peers
    // They are the core of peer-to-peer video calls
    //
    // Step 1 — initiator sends offer to partner
    // Step 2 — partner receives offer, sends answer back
    // Step 3 — both sides exchange ICE candidates
    // ─────────────────────────────────────────────────
    socket.on('offer', ({ offer, to }) => {
      socket.to(to).emit('offer', { offer, from: socket.id });
    });

    socket.on('answer', ({ answer, to }) => {
      socket.to(to).emit('answer', { answer, from: socket.id });
    });

    socket.on('ice-candidate', ({ candidate, to }) => {
      socket.to(to).emit('ice-candidate', { candidate, from: socket.id });
    });

    // ─────────────────────────────────────────────────
    // CHAT — text messages during a session
    // Frontend: socket.emit('send-message', { message, roomId })
    // ─────────────────────────────────────────────────
    socket.on('send-message', ({ message, roomId }) => {
      if (!roomData[roomId]) return;
      io.to(roomId).emit('receive-message', {
        from:      socket.id,
        userId:    socket.data.userId,
        message,
        timestamp: new Date(),
      });
    });

    // ─────────────────────────────────────────────────
    // DEBATE ACTIONS
    // ─────────────────────────────────────────────────
    socket.on('submit-argument', ({ argument, roomId }) => {
      if (!roomData[roomId]) return;
      io.to(roomId).emit('argument-received', {
        from:      socket.data.userId,
        argument,
        timestamp: new Date(),
      });
    });

    socket.on('end-debate', ({ roomId }) => {
      if (!roomData[roomId]) return;
      io.to(roomId).emit('debate-ended', {
        roomId,
        endedAt: new Date(),
        message: 'Debate ended. Calculating results...',
      });
      delete roomData[roomId];
      console.log(`✓ Debate ended in room ${roomId}`);
    });

    // ─────────────────────────────────────────────────
    // SKIP — leave current partner and find a new one
    // Frontend: socket.emit('skip', { userId, topic })
    // ─────────────────────────────────────────────────
    socket.on('skip', ({ userId, topic }) => {
      const partnerId     = connections[socket.id];
      const partnerSocket = partnerId ? io.sockets.sockets.get(partnerId) : null;

      if (partnerSocket) {
        partnerSocket.emit('partner-skipped');
        delete connections[partnerId];
      }
      delete connections[socket.id];

      if (socket.data.roomId) {
        delete roomData[socket.data.roomId];
        socket.leave(socket.data.roomId);
        socket.data.roomId = null;
      }

      socket.emit('finding-partner');

      // Try to find a new partner immediately
      const matchIndex = waitingUsers.findIndex(
        (w) => w.topic === topic && w.socketId !== socket.id
      );

      if (matchIndex !== -1) {
        const newPartner       = waitingUsers[matchIndex];
        waitingUsers.splice(matchIndex, 1);
        const newPartnerSocket = io.sockets.sockets.get(newPartner.socketId);

        if (newPartnerSocket) {
          const roomId = `room_${socket.id}_${newPartner.socketId}_${Date.now()}`;

          connections[socket.id]           = newPartner.socketId;
          connections[newPartner.socketId] = socket.id;

          socket.join(roomId);
          newPartnerSocket.join(roomId);
          socket.data.roomId           = roomId;
          newPartnerSocket.data.roomId = roomId;

          roomData[roomId] = {
            user1: userId, user2: newPartner.userId, topic, startedAt: new Date(),
          };

          socket.emit('partner-found', {
            partnerId: newPartner.socketId, partnerUserId: newPartner.userId,
            roomId, isInitiator: true, topic,
          });

          newPartnerSocket.emit('partner-found', {
            partnerId: socket.id, partnerUserId: userId,
            roomId, isInitiator: false, topic,
          });
        }
      } else {
        waitingUsers.push({ socketId: socket.id, userId, topic });
        socket.emit('waiting', { message: 'Looking for a new partner...' });
      }
    });

    // ─────────────────────────────────────────────────
    // DISCONNECT — browser closed or network lost
    // ─────────────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);

      // Remove from waiting queue
      waitingUsers = waitingUsers.filter((w) => w.socketId !== socket.id);

      // Remove from user→socket map
      if (socket.data.userId) delete userSockets[socket.data.userId];

      // Clean up room
      if (socket.data.roomId) delete roomData[socket.data.roomId];

      // Notify partner
      const partnerId     = connections[socket.id];
      const partnerSocket = partnerId ? io.sockets.sockets.get(partnerId) : null;
      if (partnerSocket) {
        partnerSocket.emit('partner-disconnected', {
          message: 'Your partner disconnected.',
        });
        delete connections[partnerId];
      }
      delete connections[socket.id];
    });
  });

  console.log('✓ Socket.io initialized');
  return io;
};

// Get io instance from other files if needed
const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized. Call initSocket first.');
  return io;
};

// Send event to a specific user by their DB userId
const emitToUser = (userId, event, data) => {
  const socketId = userSockets[userId];
  if (socketId) io.to(socketId).emit(event, data);
};

module.exports = { initSocket, getIO, emitToUser };