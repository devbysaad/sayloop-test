const express               = require('express');
const router                = express.Router();
const leaderboardController = require('./leaderboard.controller');
const { protect }           = require('../../middleware/auth.middleware');
const { validate }          = require('../../middleware/validate.middleware');
const { paginationSchema }  = require('./leaderboard.validation');

// All leaderboard routes require a valid JWT
router.use(protect);

// GET /api/leaderboard/paginated?page=0&limit=20
router.get(
  '/paginated',
  validate(paginationSchema, 'query'),   // validate req.query not req.body
  leaderboardController.getPaginatedLeaderBoard
);

// GET /api/leaderboard/top
router.get('/top', leaderboardController.getTopLeaderboard);

// GET /api/leaderboard/rank/:userId
router.get('/rank/:userId', leaderboardController.getUserRank);

module.exports = router;