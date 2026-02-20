require('dotenv').config();

const http                = require('http');
const app                 = require('./app');
const prisma              = require('./config/database');
const { initSocket }      = require('./modules/sessions/session.socket');
// const { startScheduler }  = require('./scheduler');

const PORT = process.env.PORT || 3000;

// ── Create HTTP server from Express app ───────────────
// We must use http.createServer so Socket.io can attach to the same port
const server = http.createServer(app);

// ── Attach Socket.io to the server ───────────────────
initSocket(server);

// ── Start everything ──────────────────────────────────
const startServer = async () => {
  try {
    // 1. Connect to database
    await prisma.$connect();
    console.log('✓ Database connected (Prisma)');

    // 2. Start cron jobs
    //       startScheduler();

    // 3. Start HTTP + WebSocket server on same port
    server.listen(PORT, () => {
      console.log(`✓ HTTP  server running on port ${PORT}`);
      console.log(`✓ WS    server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
};

// ── Graceful shutdown ─────────────────────────────────
const shutdown = async (signal) => {
  console.log(`\n${signal} received — shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✓ Server closed');
    console.log('✓ Database disconnected');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

startServer();