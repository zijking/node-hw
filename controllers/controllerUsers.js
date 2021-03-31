const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const fs = require('fs').promises;
const path = require('path');
const Jimp = require('jimp');
const { HttpCode } = require('../helpers/constants');
const createFolderIsExist = require('../helpers/create-dir');

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
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {
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
    console.log('currentUser req.user.id: ', req.user?.id);
    const id = req.user.id;
    const user = await await Users.findUserById(id);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      ContentType: 'application/json',
      ResponseBody: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
  return;
};

const avatars = async (req, res, next) => {
  try {
    console.log('avatar load start');
    console.log('req.user.id: ', req.user?.id);

    const id = req.user.id;

    const avatarUrl = await saveAvatarToStatic(req);

    await Users.updateAvatar(id, avatarUrl);
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      ContentType: 'application/json',
      ResponseBody: {
        avatarUrl,
      },
    });
  } catch (e) {
    next(e);
  }
};

const saveAvatarToStatic = async req => {
  const id = req.user.id;
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;

  const img = await Jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  await createFolderIsExist(path.join(AVATARS_OF_USERS, id));
  await fs.rename(pathFile, path.join(AVATARS_OF_USERS, id, newNameAvatar));
  const avatarUrl = path.normalize(path.join(id, newNameAvatar));
  try {
    await fs.unlink(
      path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatar),
    );
  } catch (e) {
    console.log(e.message);
  }
  return avatarUrl;
};

module.exports = { reg, login, logout, currentUser, avatars };
