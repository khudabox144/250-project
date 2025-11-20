const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// ------------------------------------
// REGISTER
// ------------------------------------
exports.register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

// ------------------------------------
// LOGIN
// ------------------------------------
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const tokens = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: tokens,
  });
});

// ------------------------------------
// REFRESH TOKEN
// ------------------------------------
exports.refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const newTokens = await authService.refresh(refreshToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed",
    data: newTokens,
  });
});

// ------------------------------------
// LOGOUT
// ------------------------------------
exports.logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  await authService.logout(refreshToken);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
