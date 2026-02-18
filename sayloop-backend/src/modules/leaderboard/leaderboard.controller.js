const leaderboardService = require('./leaderboard.service');
const { success, error } = require('../../utils/response');

// GET /api/leaderboard/paginated?page=0&limit=20
const getPaginatedLeaderBoard = async (req, res) => {
  try {
    const { page = 0, limit = 20 } = req.query;
    const leaderboard = await leaderboardService.getPaginatedLeaderBoard(
      parseInt(page),
      parseInt(limit)
    );
    return success(res, leaderboard, 'Leaderboard fetched successfully');
  } catch (err) {
    console.error('Error in getPaginatedLeaderBoard:', err);
    return error(res, 'Failed to get leaderboard');
  }
};

// GET /api/leaderboard/top
const getTopLeaderboard = async (req, res) => {
  try {
    const leaderboard = await leaderboardService.getTopLeaderboard();
    return success(res, leaderboard, 'Top leaderboard fetched successfully');
  } catch (err) {
    console.error('Error in getTopLeaderboard:', err);
    return error(res, 'Failed to get top leaderboard');
  }
};

// GET /api/leaderboard/rank/:userId
const getUserRank = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const rank   = await leaderboardService.getUserRank(userId);
    return success(res, rank, 'User rank fetched successfully');
  } catch (err) {
    console.error('Error in getUserRank:', err);
    return error(res, err.message || 'Failed to get user rank', 404);
  }
};

module.exports = {
  getPaginatedLeaderBoard,
  getTopLeaderboard,
  getUserRank,
};