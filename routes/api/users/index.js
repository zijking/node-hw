const express = require('express');
const router = express.Router();
const validate = require('./validation');
const userController = require('../../../controllers/controllerUsers');
const guard = require('../../../helpers/guard');
const uploads = require('../../../helpers/uploads');

router.post('/register', validate.registerUser, userController.reg);
router.post('/login', userController.login);
router.post('/logout', guard, userController.logout);
router.patch(
  '/avatar',
  [guard, uploads.single('avatar')],
  userController.avatars,
);

router.get('/current', guard, userController.currentUser);

router.get('/verify/:verificationToken', userController.verify);

module.exports = router;
