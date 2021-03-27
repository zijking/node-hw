const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
const User = require('../model/schemas/user');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

const reg = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findUserByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        ContentType: 'application/json',
        ResponseBody: 'Conflict',
        message: 'Email is already use',
      });
    }
    const newUser = await Users.createUser(req.body);
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      ContentType: 'application/json',
      ResponseBody: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findUserByEmail(email);
    if (!user || !user.validPassword(password)) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        ContentType: 'application/json',
        ResponseBody: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateUserToken(id, token);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      ContentType: 'application/json',
      ResponseBody: {
        token,
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  await Users.updateUserToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const currentUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await await Users.findUserById(id);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      ContentType: 'application/json',
      ResponseBody: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
  return;
};

module.exports = { reg, login, logout, currentUser };
