const jwt = require('jsonwebtoken');
const key = require('./key');

const generateToken = (user) => {
  const token = jwt.sign({
    email: user.email,
    id: user.id,
  }, key.tokenKey, {
    algorithm: 'HS256',
    expiresIn: '1 day',
  });

  return token;
};

module.exports = {
  generateToken,
};
