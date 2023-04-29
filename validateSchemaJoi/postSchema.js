const Joi = require("joi");

const postSchema = Joi.object({
  text: Joi.string().max(2000).min(20),
  title: Joi.string().alphanum().max(300).min(5),
});

module.exports = postSchema;
