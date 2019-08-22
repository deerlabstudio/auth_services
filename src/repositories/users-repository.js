const SQ = require('sequelize');
const bcrypt = require('bcryptjs');
const boom = require('boom');
const { Users } = require('../database/models');

const { Op } = SQ;
const saltRounds = 10;

const findAdminByEmail = async (email) => {
  const item = await Users.findOne({
    where: {
      email,
      usersTypesId: 1,
      company: 0,
    },
  });
  if (item) {
    return item;
  }
  throw boom.notFound('Bad User Info');
};

const findNotAdminByEmail = async (email) => {
  const item = await Users.findOne({
    where: {
      email,
      usersTypesId: {
        [Op.ne]: 1,
      },
      company: {
        [Op.ne]: 0,
      },
    },
  });
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

const updatePassword = async (id, password) => {
  const existingUser = await Users.findOne({ where: { id } });
  if (!existingUser) {
    throw boom.conflict('Not record found');
  }

  const saltToUse = bcrypt.genSaltSync(saltRounds);
  const securePassword = bcrypt.hashSync(password, saltToUse);

  let item = await Users.update({
    salt: saltToUse,
    password: securePassword,
  }, { where: { id } });

  if (item[0] === 1) {
    item = await Users.findOne({ where: { id } });
  } else {
    item = null;
  }
  return item;
};

module.exports = {
  findAdminByEmail,
  findNotAdminByEmail,
  updatePassword,
  store,
};
