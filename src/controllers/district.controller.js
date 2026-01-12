const District = require("../models/district.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// GET all districts
exports.getAllDistricts = catchAsync(async (req, res, next) => {
  const districts = await District.find();
  res.status(200).json({
    status: "success",
    results: districts.length,
    data: districts
  });
});

// GET districts by division
exports.getDistrictsByDivision = catchAsync(async (req, res, next) => {
  const { divisionId } = req.params;
  const districts = await District.find({ division: divisionId });

  res.status(200).json({
    status: "success",
    results: districts.length,
    data: districts
  });
});

// CREATE district
exports.createDistrict = catchAsync(async (req, res, next) => {
  const { name, divisionId } = req.body;

  if (!name || !divisionId) {
    return next(new AppError("Name and divisionId are required", 400));
  }

  const district = await District.create({
    name,
    division: divisionId
  });

  res.status(201).json({
    status: "success",
    data: district
  });
});
