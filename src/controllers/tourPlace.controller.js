const TourPlace = require("../models/tourPlace.model.js");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError.js");
const cloudinaryService = require("../services/cloudinary.service");

// Helper to parse and normalize location input into GeoJSON Point { type: 'Point', coordinates: [lng, lat] }
const parseLocation = (location, body) => {
  // If lat/lng provided separately in the body
  if ((!location || location === "") && body && body.lat && body.lng) {
    const lat = parseFloat(body.lat);
    const lng = parseFloat(body.lng);
    if (!isNaN(lat) && !isNaN(lng)) return { type: "Point", coordinates: [lng, lat] };
    return undefined;
  }

  if (!location) return undefined;

  // If location is a JSON string
  if (typeof location === "string") {
    // Try JSON parse
    try {
      const parsed = JSON.parse(location);
      return parseLocation(parsed, body);
    } catch (e) {
      // If comma-separated lat,lng string
      if (location.includes(",")) {
        const parts = location.split(",").map((s) => parseFloat(s.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          // assume 'lat,lng' -> convert to [lng, lat]
          return { type: "Point", coordinates: [parts[1], parts[0]] };
        }
      }
      return undefined;
    }
  }

  // If it's an object with lat/lng keys
  if (typeof location === "object") {
    if (location.lat !== undefined && location.lng !== undefined) {
      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lng);
      if (!isNaN(lat) && !isNaN(lng)) return { type: "Point", coordinates: [lng, lat] };
    }

    // If it's already GeoJSON-like with coordinates array
    if (Array.isArray(location.coordinates) && location.coordinates.length === 2) {
      const a = parseFloat(location.coordinates[0]);
      const b = parseFloat(location.coordinates[1]);
      if (!isNaN(a) && !isNaN(b)) {
        // Heuristic: if both a and b are <= 90 in abs value, they might be [lat,lng]
        if (Math.abs(a) <= 90 && Math.abs(b) <= 90) {
          // assume [lat, lng] -> convert
          return { type: "Point", coordinates: [b, a] };
        }
        // otherwise assume already [lng, lat]
        return { type: "Point", coordinates: [a, b] };
      }
    }
  }

  return undefined;
};

// Get all approved tour places (supports optional filters: ?district=...&division=...)
const getAllTourPlaces = catchAsync(async (req, res, next) => {
  const { district, division } = req.query;
  const filter = { isApproved: true };
  if (district) filter.district = district;
  if (division) filter.division = division;

  const tours = await TourPlace.find(filter)
    .populate("division district")
    .sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: tours.length, data: tours });
});

// Get single tour place
const getTourPlace = catchAsync(async (req, res, next) => {
  const tour = await TourPlace.findById(req.params.id).populate("division district");
  if (!tour) return next(new AppError("TourPlace not found", 404));
  res.status(200).json({ status: "success", data: tour });
});

// Create new tour place
const createTourPlace = async (req, res) => {
  try {
    // req.body contains the text fields, req.files contains the images
    const tourData = { ...req.body };

    // SYNC: Parse stringified fields coming from FormData
    if (typeof tourData.location === 'string') {
      tourData.location = JSON.parse(tourData.location);
    }

    // If files were uploaded (using memoryStorage), upload to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinaryService.uploadImage(file.buffer)
      );
      const uploaded = await Promise.all(uploadPromises);
      // store URLs in `images` and public IDs in `imagePublicIds`
      tourData.images = uploaded.map((u) => u.url);
      tourData.imagePublicIds = uploaded.map((u) => u.public_id);
    }

    // Add reference to the user who created it
    tourData.createdBy = req.user._id;

    const newTourPlace = await TourPlace.create(tourData);

    res.status(201).json({
      status: "success",
      data: newTourPlace
    });
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};

// Update tour place
const updateTourPlace = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const existing = await TourPlace.findById(tourId);
  if (!existing) return next(new AppError("TourPlace not found", 404));

  const updateData = { ...req.body };

  if (updateData.location) {
    const parsed = parseLocation(updateData.location, req.body);
    if (parsed) updateData.location = parsed;
  }

  if (req.files && req.files.length) {
    const uploadPromises = req.files.map((file) => cloudinaryService.uploadImage(file.buffer));
    const uploaded = await Promise.all(uploadPromises);
    const urls = uploaded.map((u) => u.url);
    const ids = uploaded.map((u) => u.public_id);
    updateData.images = Array.isArray(existing.images) ? existing.images.concat(urls) : urls;
    updateData.imagePublicIds = Array.isArray(existing.imagePublicIds)
      ? existing.imagePublicIds.concat(ids)
      : ids;
  }

  delete updateData.createdBy; // prevent updating creator

  const tour = await TourPlace.findByIdAndUpdate(tourId, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: "success", data: tour });
});

// Delete tour place
const deleteTourPlace = catchAsync(async (req, res, next) => {
  const tour = await TourPlace.findById(req.params.id);
  if (!tour) return next(new AppError("TourPlace not found", 404));

  // Attempt to delete images from Cloudinary if we have public IDs
  if (Array.isArray(tour.imagePublicIds) && tour.imagePublicIds.length) {
    await Promise.all(
      tour.imagePublicIds.map(async (pid) => {
        try {
          await cloudinaryService.deleteImage(pid);
        } catch (e) {
          console.error('Failed to delete Cloudinary image', pid, e);
        }
      })
    );
  }

  await TourPlace.findByIdAndDelete(req.params.id);

  res.status(204).json({ status: "success", data: null });
});

module.exports = {
  getAllTourPlaces,
  getTourPlace,
  createTourPlace,
  updateTourPlace,
  deleteTourPlace,
};
