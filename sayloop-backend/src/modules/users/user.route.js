const express          = require('express');
const router           = express.Router();
const userController   = require('./user.controller');
const { protect }      = require('../../middleware/auth.middleware');
const { validate }     = require('../../middleware/validate.middleware');
const { syncUserSchema, updateProfileSchema } = require('./user.validation');
const paths            = require('../../config/constants');

router.use(protect);

router.post(paths.SYNC_USER,   validate(syncUserSchema),      userController.syncUser);
router.get(paths.GET_ME,                                      userController.getMe);
router.put(paths.UPDATE_ME,    validate(updateProfileSchema), userController.updateMe);
router.get(paths.GET_MY_STATS,                                userController.getMyStats);

module.exports = router;
