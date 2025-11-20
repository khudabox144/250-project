const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const AppError = require("../utils/AppError.js");
const catchAsync = require("../utils/catchAsync");

// Protect middleware
module.exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new AppError("You are not logged in!", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("User no longer exists", 401));

    req.user = user;
    next();
});

// Restrict middleware: only allow certain roles
module.exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError("You are not logged in!", 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action", 403));
        }

        next();
    };
};
