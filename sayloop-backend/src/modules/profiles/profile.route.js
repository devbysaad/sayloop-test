const express           = require('express');
const router            = express.Router();
const profileController = require('./profile.controller');
const { protect }       = require('../../middleware/auth.middleware');

// All profile routes require a valid JWT
router.use(protect);

// ORDER MATTERS — specific paths before param paths
// GET /api/profiles/search?q=username
router.get('/search', profileController.searchProfiles);

// GET /api/profiles/:userId
router.get('/:userId', profileController.getPublicProfile);

// GET /api/profiles/:userId/stats
router.get('/:userId/stats', profileController.getProfileStats);

module.exports = router;