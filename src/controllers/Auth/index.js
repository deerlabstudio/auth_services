const { validateUserPassword } = require('../../utils/validate-user');
const { generateToken } = require('../../utils/jwt-utils');
const usersRepository = require('../../repositories/users-repository');

class AuthController {
  constructor(router) {
    this.router = router;
    this.router.post('/auth', this.auth);
    this.router.post('/register', this.register);
  }

  async auth(req, res, next) {
    try {
      const { body } = req;
      const user = await usersRepository.findByEmail(body.email);
      await validateUserPassword(body.password, user.password);
      const token = generateToken(user);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { body } = req;
      const item = await usersRepository.store(body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
