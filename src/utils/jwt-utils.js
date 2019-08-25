const jwt = require('jsonwebtoken');
const key = require('./key');

const generateToken = (user) => {
  const token = jwt.sign({
    email: user.email,
    company: user.company,
    id: user.id,
  }, key.tokenKey, {
    algorithm: 'HS256',
    expiresIn: '1 day',
  });

  return token;
};

const validateToken = (token) => {
  try {
    if (!token) {
      return { code: 400, token: '' };
    }

    const payload = jwt.verify(token, key.tokenKey);

    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
    if (payload.ext - nowUnixSeconds > 30) {
      return { code: 400, token: '' };
    }

    return { code: 200, token: '' };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return { code: 401, token: '' };
    }
    return { code: 400, token: '' };
  }
};

module.exports = {
  generateToken,
  validateToken,
};
