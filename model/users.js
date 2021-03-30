const User = require('./schemas/user');

const findUserByEmail = async email => {
  return await User.findOne({ email });
};

const findUserById = async id => {
  return await User.findOne({ _id: id });
};

const createUser = async ({ name, email, password, subscription }) => {
  const user = new User({ name, email, password, subscription });
  return await user.save();
};

const updateUserToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserToken,
};
