const bcrypt = require('bcryptjs');
const boom = require('boom');
const { Users } = require('../database/models');

const saltRounds = 10;

const findByEmail = async (email) => {
  const item = await Users.findOne({ where: { email } });
  if (item) {
    return item;
  }
  throw boom.notFound('Bad User Info');
};

const store = async (user) => {
  const existingUser = await Users.findOne({ where: { email: user.email } });
  if (existingUser) {
    throw boom.conflict('Record Exist');
  }

  const saltToUse = bcrypt.genSaltSync(saltRounds);
  const securePassword = bcrypt.hashSync(user.password, saltToUse);
  const item = await Users.create({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    salt: saltToUse,
    password: securePassword,
    avatar: '',
    status: true,
    usersTypesId: user.usersTypesId,
    company: user.company,
  });
  return item;
};

module.exports = {
  findByEmail,
  store,
};
