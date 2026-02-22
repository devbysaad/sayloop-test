const leaderboardService = require('./leaderboard.service');
const { success, error } = require('../../utils/response');

// GET /api/leaderboard/paginated?page=0&limit=20
const getPaginatedLeaderBoard = async (req, res) => {
  try {
    const { page = '0', limit = '20' } = req.query;
    const data = await leaderboardService.getPaginatedLeaderBoard(
      parseInt(page),
      parseInt(limit)
    );
    return success(res, data, 'Leaderboard fetched successfully');
  } catch (err) {
    console.error('[leaderboard] getPaginated error:', err);
    return error(res, 'Failed to get leaderboard', 500);
  }
};

// GET /api/leaderboard/top
const getTopLeaderboard = async (req, res) => {
  try {
    const data = await leaderboardService.getTopLeaderboard();
    return success(res, data, 'Top leaderboard fetched successfully');
  } catch (err) {
    console.error('[leaderboard] getTop error:', err);
    return error(res, 'Failed to get top leaderboard', 500);
  }
};

// GET /api/leaderboard/rank/:userId
const getUserRank = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return error(res, 'Invalid userId', 400);

    const data = await leaderboardService.getUserRank(userId);
    return success(res, data, 'User rank fetched successfully');
  } catch (err) {
    console.error('[leaderboard] getUserRank error:', err);
    return error(res, err.message || 'Failed to get user rank', 404);
  }
};

module.exports = {
  getPaginatedLeaderBoard,
  getTopLeaderboard,
  getUserRank,
};