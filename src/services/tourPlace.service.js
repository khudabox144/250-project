// services/tour.service.js
const TourPlace = require("../models/tourPlace.model.js");

const createTourPlace = async (tourData) => {
  return await TourPlace.create(tourData);
};

const approveTourPlace = async (id) => {
  return await TourPlace.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true }
  );
};

const rejectTourPlace = async (id) => {
  return await TourPlace.findByIdAndDelete(id);
};

const getApprovedTours = async (limit = 12) => {
  return await TourPlace.find({ isApproved: true }).limit(limit);
};

const getToursByDistrict = async (district) => {
  return await TourPlace.find({ district, isApproved: true });
};

const getToursByUser = async (userId) => {
  return await TourPlace.find({ createdBy: userId }).sort({ createdAt: -1 });
};

const getTourDetails = async (id) => {
  return await TourPlace.findById(id);
};

module.exports = { createTourPlace, approveTourPlace, rejectTourPlace, getApprovedTours, getToursByDistrict, getTourDetails, getToursByUser };
