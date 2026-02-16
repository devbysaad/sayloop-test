const db = require('../../config/database');
const getQuestsByUser = async (userId) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const result = await db.query(
            `SELECT 
        qd.id as quest_id,
        qd.code,
        qd.target,
        qd.reward_points,
        COALESCE(udq.progress, 0) as progress,
        udq.completed_at,
        udq.reward_claimed
       FROM quest_definition qd
       LEFT JOIN user_daily_quest udq ON qd.id = udq.quest_def_id 
         AND udq.user_id = $1 
         AND udq.date = $2
       WHERE qd.active = TRUE`,
            [userId, today]
        );
        return result.rows;
    } catch (error) {
        console.error('Error in getQuestsByUser:', error);
        throw error;
    }
};
const getMonthlyChallenge = async (userId) => {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const result = await db.query(
            `SELECT 
        mcd.id as challenge_id,
        mcd.code,
        mcd.target,
        mcd.reward_points,
        COALESCE(umc.progress, 0) as progress,
        umc.completed_at,
        umc.reward_claimed
       FROM monthly_challenge_definition mcd
       LEFT JOIN user_monthly_challenge umc ON mcd.id = umc.challenge_def_id 
         AND umc.user_id = $1 
         AND umc.year = $2 
         AND umc.month = $3
       WHERE mcd.active = TRUE`,
            [userId, year, month]
        );
        return result.rows;
    } catch (error) {
        console.error('Error in getMonthlyChallenge:', error);
        throw error;
    }
};
module.exports = {
    getQuestsByUser,
    getMonthlyChallenge
};
s