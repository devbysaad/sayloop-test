const db = require('../../config/database');

const getPaginatedLeaderBoard = async (page = 0 ,limit=20)=>{
    try {
        const offset = page*limit
        const result = await db.query(
            `SELECT id, username, first_name, last_name, pfp_source, points, streak_length
             FROM users
             ORDER BY points DESC, id ASC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
          );
          return result.rows.map((user, index) => ({
            rank: offset + index + 1,
            id: user.id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            pfpSource: user.pfp_source,
            points: user.points,
            streakLength: user.streak_length
          }));
        } catch (error) {
          console.error('Error in getPaginatedLeaderboard:', error);
          throw error;
        }
}

const getTopLeaderboard = async () => {
    return getPaginatedLeaderBoard(0, 10);
  };


module.exports = {
    getPaginatedLeaderBoard,
    getTopLeaderboard
  };
  