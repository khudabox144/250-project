const Package = require("../models/package.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// Get all approved packages
const getAllPackages = catchAsync(async (req, res, next) => {
  const packages = await Package.find({ isApproved: true })
    .populate("vendor division district")
    .sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: packages.length, data: packages });
});

// Get single package
const getPackage = catchAsync(async (req, res, next) => {
  const pkg = await Package.findById(req.params.id).populate("vendor division district");
  if (!pkg) return next(new AppError("Package not found", 404));
  res.status(200).json({ status: "success", data: pkg });
});

// Create package (vendor submission)
const createPackage = catchAsync(async (req, res, next) => {
  const newPackage = await Package.create({
    ...req.body,
    vendor: req.user.vendorId, // vendor ID linked from middleware
    isApproved: req.user.role === "admin",
  });
  res.status(201).json({ status: "success", data: newPackage });
});

// Update package
const updatePackage = catchAsync(async (req, res, next) => {
  const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!pkg) return next(new AppError("Package not found", 404));
  res.status(200).json({ status: "success", data: pkg });
});

// Delete package
const deletePackage = catchAsync(async (req, res, next) => {
  const pkg = await Package.findByIdAndDelete(req.params.id);
  if (!pkg) return next(new AppError("Package not found", 404));
  res.status(204).json({ status: "success", data: null });
});

module.exports = {
  getAllPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
};
