const TourPlace = require("../models/tourPlace.model.js");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError.js");

// Get all approved tour places
const getAllTourPlaces = catchAsync(async (req, res, next) => {
  const tours = await TourPlace.find({ isApproved: true })
    .populate("division district")
    .sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: tours.length, data: tours });
});

// Get single tour place by ID
const getTourPlace = catchAsync(async (req, res, next) => {
  const tour = await TourPlace.findById(req.params.id).populate("division district");
  if (!tour) return next(new AppError("TourPlace not found", 404));
  res.status(200).json({ status: "success", data: tour });
});

// Create new tour place (user submission)
const createTourPlace = catchAsync(async (req, res, next) => {
  const newTour = await TourPlace.create({
    ...req.body,
    createdBy: req.user._id,
    isApproved: req.user.role === "admin", // auto-approved if admin
  });
  res.status(201).json({ status: "success", data: newTour });
});

// Update tour place (Admin or Owner)
const updateTourPlace = catchAsync(async (req, res, next) => {
  const tour = await TourPlace.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) return next(new AppError("TourPlace not found", 404));
  res.status(200).json({ status: "success", data: tour });
});

// Delete tour place
const deleteTourPlace = catchAsync(async (req, res, next) => {
  const tour = await TourPlace.findByIdAndDelete(req.params.id);
  if (!tour) return next(new AppError("TourPlace not found", 404));
  res.status(204).json({ status: "success", data: null });
});

module.exports = {
  getAllTourPlaces,
  getTourPlace,
  createTourPlace,
  updateTourPlace,
  deleteTourPlace,
};
