const validate = (schema, source = 'body') => (req, res, next) => {
  const target = source === 'query' ? req.query : req.body;

  const result = schema.safeParse(target);

  if (!result.success) {
    const messages = result.error.errors.map((e) => e.message).join(', ');
    return res.status(400).json({ success: false, message: messages });
  }

  // Write parsed/transformed values back so controllers receive clean data
  if (source === 'query') {
    req.query = result.data;
  } else {
    req.body = result.data;
  }

  next();
};

module.exports = { validate };