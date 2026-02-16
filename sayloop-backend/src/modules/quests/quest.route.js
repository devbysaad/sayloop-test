const express = require('express');
const router = express.Router();
const questController = require('./quest.controller');
const { authMiddleware } = require('../../middleware/auth');
const paths = require('../../config/constants');
// GET /api/quests/get (protected)
router.get(paths.GET_QUESTS_BY_USER, authMiddleware, questController.getQuestsByUser);
module.exports = router;