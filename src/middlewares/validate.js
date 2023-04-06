const { validationResult } = require("express-validator");

const validate = (req, resp, next) => {
  const errors = validationResult(req).array();
  if (errors.length >= 1) {
    return resp.status(400).json({ errors });
  }
  next();
};

module.exports = { validate };
