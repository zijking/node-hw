const { SubscriptionType } = require('../../helpers/constants');
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 8;
const gravatar = require('gravatar');

const userSchema = new Schema({
  email: {
    type: String,
    require: [true, 'Email require'],
    unique: true,
    validate(value) {
      const re = /\S+@\S+\.\S+/;
      return re.test(String(value).toLowerCase());
    },
  },
  password: {
    type: String,
    required: [true, 'Password required'],
  },
  subscription: {
    type: String,
    enum: [
      SubscriptionType.FREE,
      SubscriptionType.PRO,
      SubscriptionType.PREMIUM,
    ],
    default: SubscriptionType.FREE,
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '250' }, true);
    },
  },
  verificationToken: { type: String, require: [true, 'Veryfi token require'] },
  verify: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
