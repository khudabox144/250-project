const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const mapService = require("../services/map.service");

const getRoute = catchAsync(async (req, res, next) => {
  const { startLat, startLng, destLat, destLng } = req.query;

  if (!startLat || !startLng || !destLat || !destLng) {
    return next(new AppError("Please provide start and destination coordinates", 400));
  }

  const routeData = await mapService.getRoute(startLat, startLng, destLat, destLng);

  if (!routeData) {
    return next(new AppError("Could not calculate route", 500));
  }

  res.status(200).json({
    status: "success",
    data: routeData,
  });
});

module.exports = { getRoute };
