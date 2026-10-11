const userService = require('../services/user.service');

async function createUser(req, res) {
  const user = await userService.createUser(req.body);
  return res.status(201).json({
    success: true,
    message: 'User created successfully.',
    data: user
  });
}

async function getUser(req, res) {
  const user = await userService.getUserById(req.params.id);
  return res.status(200).json({
    success: true,
    message: 'User retrieved successfully.',
    data: user
  });
}

module.exports = { createUser, getUser };
