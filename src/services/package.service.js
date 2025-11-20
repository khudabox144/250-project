// services/package.service.js
const TourPackage = require("../models/package.model.js");

const createPackage = async (data) => {
  return await TourPackage.create(data);
};

const approvePackage = async (id) => {
  return await TourPackage.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true }
  );
};

const rejectPackage = async (id) => {
  return await TourPackage.findByIdAndDelete(id);
};

const getApprovedPackages = async (limit = 12) => {
  return await TourPackage.find({ isApproved: true }).limit(limit);
};

const getPackagesByVendor = async (vendorId) => {
  return await TourPackage.find({ vendor: vendorId, isApproved: true });
};

const getPackageDetails = async (id) => {
  return await TourPackage.findById(id);
};

module.exports = {
  createPackage,
  approvePackage,
  rejectPackage,
  getApprovedPackages,
  getPackagesByVendor,
  getPackageDetails,
};
