const Review = require("../models/review.model.js");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError.js");

// Add review
const createReview = catchAsync(async (req, res, next) => {
  const { targetType, targetId, rating, comment } = req.body;
  const review = await Review.create({
    user: req.user._id,
    targetType,
    targetId,
    rating,
    comment,
  });
  res.status(201).json({ status: "success", data: review });
});

// Get reviews by target
const getReviewsByTarget = catchAsync(async (req, res, next) => {
  const { targetType, targetId } = req.params;
  const reviews = await Review.find({ targetType, targetId }).populate("user", "name");
  res.status(200).json({ status: "success", results: reviews.length, data: reviews });
});

module.exports = {
  createReview,
  getReviewsByTarget,
};
