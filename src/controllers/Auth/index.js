const { validateUserPassword, validateUserActive } = require('../../utils/validate-user');
const { generateToken, validateToken } = require('../../utils/jwt-utils');
const usersRepository = require('../../repositories/users-repository');

class AuthController {
  constructor(router) {
    this.router = router;
    this.router.post('/admin/auth', this.authAdmin);
    this.router.post('/company/auth', this.authCompanyUser);
    this.router.post('/register', this.register);
    this.router.post('/updatepassword', this.updatePassword);
    this.router.get('/verify-token', this.verifyToken);
  }

  async authAdmin(req, res, next) {
    try {
      const { body } = req;
      const user = await usersRepository.findAdminByEmail(body.email);
      await validateUserPassword(body.password, user.password);
      await validateUserActive(user);
      const token = generateToken(user);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  async authCompanyUser(req, res, next) {
    try {
      const { body } = req;
      const user = await usersRepository.findNotAdminByEmail(body.email);
      await validateUserPassword(body.password, user.password);
      await validateUserActive(user);
      const token = generateToken(user);
      res.json({ token, company: user.company });
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

  async updatePassword(req, res, next) {
    try {
      const { id, password } = req.body;
      const item = await usersRepository.updatePassword(id, password);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  verifyToken(req, res, next) {
    try {
      const { authorization } = req.headers;
      const validateResponse = validateToken(authorization);
      res.status(validateResponse.code).json({ message: validateResponse.token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
