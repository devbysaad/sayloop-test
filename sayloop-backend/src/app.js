const express = require('express');
const cors = require('cors')
require('dotenv').config()

// imported routes
const courseRoute = require('./modules/courses/course.route');


// paths
const paths = require('./config/constants');
const { check } = require('drizzle-orm/gel-core');
const app = express()

// middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());


// health check
app.get('/', (req, res) => {
    res.json({ message: 'Sayloop API is running', status: 'healthy' });
});

// mount routes
app.use(paths.COURSES, courseRoute)



// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error'
    });
  });
module.exports = app;