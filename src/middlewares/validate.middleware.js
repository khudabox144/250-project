const AppError = require("../utils/AppError.js");

const validateBody = (req, res, next) => {
  const body = req.body;
  if (!body || Object.keys(body).length === 0) {
    return next(new AppError("Request body cannot be empty", 400));
  }
  next();
};

module.exports = { validateBody };
