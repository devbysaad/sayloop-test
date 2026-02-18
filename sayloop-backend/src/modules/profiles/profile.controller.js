const profileService     = require('./profile.service');
const { success, error } = require('../../utils/response');

// GET /api/profiles/:userId
const getPublicProfile = async (req, res) => {
  try {
    const userId  = parseInt(req.params.userId);
    const profile = await profileService.getPublicProfile(userId);
    return success(res, profile, 'Profile fetched');
  } catch (err) {
    return error(res, err.message || 'User not found', 404);
  }
};

// GET /api/profiles/search?q=username
const searchProfiles = async (req, res) => {
  try {
    const { q } = req.query;
    const users  = await profileService.searchProfiles(q);
    return success(res, users, 'Search results');
  } catch (err) {
    return error(res, err.message || 'Search failed', 400);
  }
};

// GET /api/profiles/:userId/stats
const getProfileStats = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const stats  = await profileService.getProfileStats(userId);
    return success(res, stats, 'Stats fetched');
  } catch (err) {
    return error(res, err.message || 'Failed to get stats', 404);
  }
};

module.exports = { getPublicProfile, searchProfiles, getProfileStats };
