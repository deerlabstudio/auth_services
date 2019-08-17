const bcrypt = require('bcryptjs');
const boom = require('boom');

const validateUserPassword = async (password, hash) => {
  const isValid = bcrypt.compareSync(password, hash);
  if (isValid) return true;
  throw boom.notFound('Bad User Info');
};

module.exports = {
  validateUserPassword,
};
