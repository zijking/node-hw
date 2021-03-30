const Joi = require('joi');
const { HttpCode } = require('../../../helpers/constants');

const schemaRefisterUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Filed: ${message.replace(/"/g, '')}`,
    });
  }
  next();
};

module.exports.registerUser = (req, res, next) => {
  return validate(schemaRefisterUser, req.body, next);
};
