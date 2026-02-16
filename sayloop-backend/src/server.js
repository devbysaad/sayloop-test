require('dotenv').config();
const app = require('./app');
const { pool } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✓ Database connected');
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  console.log('\nShutting down...');
  pool.end(() => {
    console.log('✓ Database closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  pool.end(() => {
    console.log('✓ Database closed');
    process.exit(0);
  });
});

startServer();