const { clerkClient } = require('@clerk/clerk-sdk-node');
const { error } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Unauthorized — no token provided', 401);
    }
    const token = authHeader.split(' ')[1];
    const { sub: clerkId } = await clerkClient.verifyToken(token);
    req.user = { clerkId };
    next();
  } catch (err) {
    return error(res, 'Unauthorized — invalid or expired token', 401);
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return error(res, 'Forbidden — admin access only', 403);
  }
  next();
};

module.exports = { protect, adminOnly };
