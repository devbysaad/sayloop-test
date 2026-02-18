const express               = require('express');
const router                = express.Router();
const leaderboardController = require('./leaderboard.controller');
const { protect }           = require('../../middleware/auth.middleware');
const { validate }          = require('../../middleware/validate.middleware');
const { paginationSchema }  = require('./leaderboard.validation');
const paths                 = require('../../config/constants');

// All leaderboard routes require authentication
router.use(protect);

router.get(paths.GET_PAGINATED_LEADERBOARD, validate(paginationSchema), leaderboardController.getPaginatedLeaderBoard);
router.get(paths.GET_TOP_LEADERBOARD,       leaderboardController.getTopLeaderboard);
router.get(paths.GET_USER_RANK,             leaderboardController.getUserRank);

module.exports = router;