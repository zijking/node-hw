const express = require('express');
const router = express.Router();
const validate = require('./validation');
const userController = require('../../../controllers/controllerUsers');
const guard = require('../../../helpers/guard');

router.post('/register', validate.registerUser, userController.reg);
router.post('/login', userController.login);
router.post('/logout', guard, userController.logout);

router.get('/current', guard, userController.currentUser);

module.exports = router;
