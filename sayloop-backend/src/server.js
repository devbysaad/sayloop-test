require('dotenv').config();
const app = require('./app');
const prisma = require('./config/database');
const { startScheduler } = require('./utils/scheduler');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✓ Database connected (Prisma)');
    startScheduler();
    app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`\n${signal} — shutting down...`);
  await prisma.$disconnect();
  console.log('✓ Database disconnected');
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();
