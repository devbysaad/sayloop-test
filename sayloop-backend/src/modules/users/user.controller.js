const userService = require('./user.service');
const { success, error } = require('../../utils/response');

// POST /api/users/sync
// Called immediately after every Clerk login (before onboarding).
// clerkId is read from the verified JWT only — never from the request body.
const syncUser = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      console.warn('[syncUser] req.auth.userId is empty — Clerk token verification likely failed');
      return error(res, 'Unauthorized — no valid Clerk session', 401);
    }

    const { email, firstName, lastName, pfpSource } = req.body;
    if (!email) return error(res, 'email is required', 400);

    const user = await userService.syncUser(clerkId, { email, firstName, lastName, pfpSource });
    return success(res, user, 'User synced successfully', 201);
  } catch (err) {
    console.error('[syncUser]', err?.message ?? err);
    return error(res, 'Failed to sync user');
  }
};

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    const user = await userService.getMyProfile(req.dbUserId);
    return success(res, user, 'Profile fetched');
  } catch (err) {
    console.error('[getMe]', err?.message ?? err);
    return error(res, 'Failed to get profile');
  }
};

// PUT /api/users/me
// Also called after onboarding to persist learningLanguage + interests to DB.
const updateMe = async (req, res) => {
  try {
    const { username, firstName, lastName, pfpSource, learningLanguage, interests } = req.body;
    const user = await userService.updateProfile(req.dbUserId, {
      username, firstName, lastName, pfpSource, learningLanguage, interests,
    });
    return success(res, user, 'Profile updated');
  } catch (err) {
    console.error('[updateMe]', err?.message ?? err);
    return error(res, err.message || 'Failed to update profile', 400);
  }
};

// GET /api/users/me/stats
const getMyStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats(req.dbUserId);
    return success(res, stats, 'Stats fetched');
  } catch (err) {
    console.error('[getMyStats]', err?.message ?? err);
    return error(res, 'Failed to get stats');
  }
};

module.exports = { syncUser, getMe, updateMe, getMyStats };