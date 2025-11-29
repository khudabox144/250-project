const TourPlace = require("../models/tourPlace.model");
const Package = require("../models/package.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const User = require("../models/user.model");
const Review = require("../models/review.model");

// Approve a tour place
const approveTourPlace = catchAsync(async (req, res, next) => {
  const tour = await TourPlace.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  if (!tour) return next(new AppError("TourPlace not found", 404));
  res.status(200).json({ status: "success", data: tour });
});

// Reject a tour place
const rejectTourPlace = catchAsync(async (req, res, next) => {
  const tour = await TourPlace.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
  if (!tour) return next(new AppError("TourPlace not found", 404));
  res.status(200).json({ status: "success", data: tour });
});

// Approve package
const approvePackage = catchAsync(async (req, res, next) => {
  const pkg = await Package.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  if (!pkg) return next(new AppError("Package not found", 404));
  res.status(200).json({ status: "success", data: pkg });
});

// Reject package
const rejectPackage = catchAsync(async (req, res, next) => {
  const pkg = await Package.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
  if (!pkg) return next(new AppError("Package not found", 404));
  res.status(200).json({ status: "success", data: pkg });
});

// ADMIN DASHBOARD: summary counts and recent items
const getDashboard = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalTours = await TourPlace.countDocuments();
  const pendingTours = await TourPlace.countDocuments({ isApproved: false });
  const totalPackages = await Package.countDocuments();
  const pendingPackages = await Package.countDocuments({ isApproved: false });
  const totalReviews = await Review.countDocuments();

  // recent items
  const recentTours = await TourPlace.find().sort({ createdAt: -1 }).limit(5).select('name isApproved createdAt createdBy');
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalTours,
      pendingTours,
      totalPackages,
      pendingPackages,
      totalReviews,
      recentTours,
      recentUsers,
    }
  });
});

// LIST pending tour places (with pagination optional)
const getPendingTourPlaces = catchAsync(async (req, res, next) => {
  const pending = await TourPlace.find({ isApproved: false }).sort({ createdAt: -1 }).limit(50);
  res.status(200).json({ status: 'success', results: pending.length, data: pending });
});

// LIST pending packages
const getPendingPackages = catchAsync(async (req, res, next) => {
  const pending = await Package.find({ isApproved: false }).sort({ createdAt: -1 }).limit(50);
  res.status(200).json({ status: 'success', results: pending.length, data: pending });
});

// LIST users (recent)
const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(100).select('-password');
  res.status(200).json({ status: 'success', results: users.length, data: users });
});

module.exports = {
  approveTourPlace,
  rejectTourPlace,
  approvePackage,
  rejectPackage,
  // new admin read endpoints
  getDashboard,
  getPendingTourPlaces,
  getPendingPackages,
  getUsers,
};
