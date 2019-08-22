const bcrypt = require('bcryptjs');
const boom = require('boom');

const validateUserPassword = async (password, hash) => {
  const isValid = bcrypt.compareSync(password, hash);
  if (isValid) return true;
  throw boom.notFound('Bad User Info');
};

const validateUserActive = async (user) => {
  if (user.status) return Promise.resolve();
  return Promise.reject(new Error('User Inactive'));
};

module.exports = {
  validateUserPassword,
  validateUserActive,
};
