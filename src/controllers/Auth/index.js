const { validateUserPassword, validateUserActive } = require('../../utils/validate-user');
const { generateToken } = require('../../utils/jwt-utils');
const usersRepository = require('../../repositories/users-repository');

class AuthController {
  constructor(router) {
    this.router = router;
    this.router.post('/admin/auth', this.authAdmin);
    this.router.post('/company/auth', this.authCompanyUser);
    this.router.post('/register', this.register);
    this.router.post('/updatepassword', this.updatePassword);
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

  async updatePassword(req, res, next) {
    try {
      const { id, password } = req.body;
      const item = await usersRepository.updatePassword(id, password);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
