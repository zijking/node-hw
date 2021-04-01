const User = require('./schemas/user');

const findUserByEmail = async email => {
  return await User.findOne({ email });
};

const findUserById = async id => {
  return await User.findOne({ _id: id });
};

const createUser = async ({
  name,
  email,
  password,
  subscription,
  verify,
  verificationToken,
}) => {
  const user = new User({
    name,
    email,
    password,
    subscription,
    verify,
    verificationToken,
  });
  return await user.save();
};

const updateUserToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateAvatar = async (id, avatarUrl) => {
  return await User.updateOne({ _id: id }, { avatarURL: avatarUrl });
};

const findByVerifyToken = async verifyToken => {
  return await User.findOne({ verificationToken: verifyToken });
};

const updateVerifyToken = async (id, verify, verifyToken) => {
  return await User.findOneAndUpdate(
    { _id: id },
    { verify, verificationToken: verifyToken },
  ); // [1]
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserToken,
  updateAvatar,
  findByVerifyToken,
  updateVerifyToken,
};
