const AppError = require("../utils/AppError.js");

const roleCheck = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission for this action", 403));
  }
  next();
};

module.exports = { roleCheck };
