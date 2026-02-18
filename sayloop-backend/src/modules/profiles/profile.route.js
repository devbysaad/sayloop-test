const express            = require('express');
const router             = express.Router();
const profileController  = require('./profile.controller');
const { protect }        = require('../../middleware/auth.middleware');
const paths              = require('../../config/constants');

router.use(protect);

router.get(paths.SEARCH_PROFILES,    profileController.searchProfiles);
router.get(paths.GET_PUBLIC_PROFILE, profileController.getPublicProfile);
router.get(paths.GET_PROFILE_STATS,  profileController.getProfileStats);

module.exports = router;
