const Joi = require("joi");

const userRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30),
  username: Joi.string().max(30),
});

module.exports = userRegisterSchema;
