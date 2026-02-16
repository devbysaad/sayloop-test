const express = require('express');
const router = express.Router();
const leaderboardController = require('./leaderboard.controller');
const paths = require('../../config/constants');

router.get(paths.GET_PAGINATED_LEADERBOARD, leaderboardController.getPaginatedLeaderBoard);
router.get(paths.GET_TOP_LEADERBOARD, leaderboardController.getTopLeaderboard);

module.exports = router;
