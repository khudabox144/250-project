const Division = require("../models/division.model.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/AppError.js");

// GET all divisions
exports.getAllDivisions = catchAsync(async (req, res, next) => {
    const divisions = await Division.find();
    res.status(200).json({
        status: "success",
        results: divisions.length,
        data: divisions
    });
});

// POST a new division (admin only)
exports.createDivision = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return next(new AppError("Division name is required", 400));
    }
    const division = await Division.create({ name });
    res.status(201).json({
        status: "success",
        data: division
    });
});
