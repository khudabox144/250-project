const TourPlace = require("../models/tourPlace.model");
const Package = require("../models/package.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

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

module.exports = {
  approveTourPlace,
  rejectTourPlace,
  approvePackage,
  rejectPackage,
};
