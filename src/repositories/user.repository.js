const User = require('../models/user.model');

function create(data) {
  return User.create(data);
}

function findAll() {
  return User.find();
}

function findById(id) {
  return User.findById(id);
}

module.exports = { create, findAll, findById };
