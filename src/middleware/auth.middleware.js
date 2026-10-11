const asyncHandler = require('../utils/async-handler');
const User = require('../models/user.model');

function requireAdminToken(req, res, next) {
  const configuredToken = process.env.ADMIN_TOKEN;
  const authorization = req.get('authorization') || '';
  const suppliedToken = authorization.startsWith('Bearer ')
    ? authorization.slice(7).trim()
    : '';

  if (!configuredToken) {
    return res.status(500).json({
      success: false,
      message: 'Server authentication is not configured.',
      errors: []
    });
  }

  if (!suppliedToken || suppliedToken !== configuredToken) {
    return res.status(401).json({
      success: false,
      message: 'A valid admin bearer token is required.',
      errors: []
    });
  }

  return next();
}

const requireUser = asyncHandler(async (req, res, next) => {
  const userId = req.get('x-user-id');

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'x-user-id header is required.',
      errors: []
    });
  }

  if (!/^[a-fA-F0-9]{24}$/.test(userId)) {
    return res.status(400).json({
      success: false,
      message: 'x-user-id must be a valid user ID.',
      errors: []
    });
  }

  const user = await User.findById(userId).select('_id name').lean();
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'The supplied user does not exist.',
      errors: []
    });
  }

  req.authUser = user;
  return next();
});

module.exports = { requireAdminToken, requireUser };
