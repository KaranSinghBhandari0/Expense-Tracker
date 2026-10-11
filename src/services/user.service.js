const userRepository = require('../repositories/user.repository');
const { isValidObjectId } = require('../utils/object-id');

async function createUser(data) {
  return userRepository.create({ name: data.name.trim() });
}

async function getUserById(id) {
  if (!isValidObjectId(id)) {
    const error = new Error('Invalid user ID.');
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

module.exports = { createUser, getUserById };
