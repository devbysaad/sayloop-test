const express    = require('express');
const router     = express.Router();
const controller = require('./user.controller');
const { clerkAuth, protect } = require('../../middleware/auth.middleware');
const { validate }           = require('../../middleware/validate.middleware');
const { syncUserSchema, updateProfileSchema } = require('./user.validation');

// POST /api/users/sync
// clerkAuth only — resolveDbUser cannot run before the user exists in DB yet
router.post('/sync',
  clerkAuth,
  validate(syncUserSchema),
  controller.syncUser,
);

// GET  /api/users/me
router.get('/me',
  protect,
  controller.getMe,
);

// PUT  /api/users/me — also called after onboarding to save language + interests
router.put('/me',
  protect,
  validate(updateProfileSchema),
  controller.updateMe,
);

// GET  /api/users/me/stats
router.get('/me/stats',
  protect,
  controller.getMyStats,
);

module.exports = router;