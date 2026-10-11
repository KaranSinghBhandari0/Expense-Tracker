const User = require('../models/user.model');

function create(data) {
  return User.create(data);
}

function findById(id) {
  return User.findById(id);
}

module.exports = { create, findById };
