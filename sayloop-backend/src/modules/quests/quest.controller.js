const questService = require('./quest.service');
const getQuestsByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const quests = await questService.getQuestsByUser(userId);
    return res.status(200).json(quests);
  } catch (error) {
    console.error('Error in getQuestsByUser:', error);
    return res.status(500).json({ error: 'Failed to get quests' });
  }
};
module.exports = {
  getQuestsByUser
};
