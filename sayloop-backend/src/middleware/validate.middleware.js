const { error } = require('../utils/response');

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const messages = result.error.errors.map((e) => e.message).join(', ');
    return error(res, messages, 400);
  }
  req.body = result.data;
  next();
};

module.exports = { validate };
