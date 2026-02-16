const leaderboardService = require('./leaderboard.service');


const getPaginatedLeaderBoard = async (req, res) => {
    try {
        const { page = 0, limit = 20 } = req.query;
        const leaderboard = await leaderboardService.getPaginatedLeaderBoard(
            parseInt(page),
            parseInt(limit)
        );
        return res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error in getPaginatedLeaderBoard:', error);
        return res.status(500).json({ error: 'Failed to get leaderboard' });
    }
};
const getTopLeaderboard = async (req, res) => {
    try {
        const leaderboard = await leaderboardService.getTopLeaderboard();
        return res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error in getTopLeaderboard:', error);
        return res.status(500).json({ error: 'Failed to get leaderboard' });
    }
};
module.exports = {
    getPaginatedLeaderBoard,
    getTopLeaderboard
};