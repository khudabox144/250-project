// services/review.service.js
const Review = require("../models/review.model.js");

const addReview = async (data) => {
  return await Review.create(data);
};

const getReviewsForTour = async (tourId) => {
  return await Review.find({ targetType: "tourPlace", targetId: tourId });
};

const getReviewsForPackage = async (packageId) => {
  return await Review.find({ targetType: "package", targetId: packageId });
};

const getReviewsForVendor = async (vendorId) => {
  return await Review.find({ targetType: "vendor", targetId: vendorId });
};

module.exports = { addReview, getReviewsForTour, getReviewsForPackage, getReviewsForVendor };
