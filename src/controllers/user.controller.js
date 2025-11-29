const userService = require('../services/user.service');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const tourService = require('../services/tourPlace.service');
const packageService = require('../services/package.service');

exports.createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    success: true,
    data: users,
  });
});

exports.getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const deleted = await userService.deleteUser(req.params.id);

  if (!deleted) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// Backwards-compatible alias expected by routes
exports.getUser = exports.getUserById;

// Get current user's submitted tours
exports.getMyTours = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const tours = await tourService.getToursByUser(userId);
  res.status(200).json({ status: 'success', results: tours.length, data: tours });
});

// Get current user's packages (if vendor)
exports.getMyPackages = catchAsync(async (req, res) => {
  const userId = req.user._id;
  // If vendor, include all; otherwise return empty
  const packages = await packageService.getPackagesByVendorAll(userId);
  res.status(200).json({ status: 'success', results: packages.length, data: packages });
});
