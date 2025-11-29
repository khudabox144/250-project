const TourPlace = require("../models/tourPlace.model.js");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError.js");
const fileService = require("../services/file.service");

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
const createTourPlace = catchAsync(async (req, res, next) => {
  // Debug: log incoming request shape to help diagnose client/server mismatch
  console.log("[createTourPlace] headers:", req.headers && { authorization: req.headers.authorization, 'content-type': req.headers['content-type'] });
  console.log("[createTourPlace] body:", req.body);
  console.log("[createTourPlace] files:", req.files && req.files.map(f => ({ originalname: f.originalname, size: f.size, mimetype: f.mimetype })));
  console.log("[createTourPlace] user:", req.user && { id: req.user._id, role: req.user.role });

  const { name, description, division, district, location } = req.body;

  if (!name) return next(new AppError("Missing required field: name", 400));
  if (!division) return next(new AppError("Missing required field: division", 400));
  if (!district) return next(new AppError("Missing required field: district", 400));

  const parsedLocation = parseLocation(location, req.body);
  if (!parsedLocation || !Array.isArray(parsedLocation.coordinates) || parsedLocation.coordinates.length !== 2) {
    console.warn("[createTourPlace] invalid parsedLocation:", parsedLocation);
    return next(new AppError("Missing or invalid location (coordinates required)", 400));
  }

  // Persist uploaded images (memoryStorage) to uploads/ and store paths
  const images = [];
  if (req.files && req.files.length) {
    for (const f of req.files) {
      const savedPath = fileService.saveLocalFile(f); // returns string like 'uploads/filename.ext'
      // Normalize to forward slashes for URLs
      images.push(savedPath.replace(/\\\\/g, "/"));
    }
  }

  const tourData = {
    name,
    description,
    division,
    district,
    location: parsedLocation,
    images,
    createdBy: req.user ? req.user._id : undefined,
    isApproved: req.user && req.user.role === "admin",
  };

  const newTour = await TourPlace.create(tourData);
  res.status(201).json({ status: "success", data: newTour });
});

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
    const uploaded = [];
    for (const f of req.files) {
      const savedPath = fileService.saveLocalFile(f);
      uploaded.push(savedPath.replace(/\\\\/g, "/"));
    }
    updateData.images = Array.isArray(existing.images) ? existing.images.concat(uploaded) : uploaded;
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
