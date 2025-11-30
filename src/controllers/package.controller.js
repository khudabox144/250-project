// controllers/package.controller.js
const Package = require("../models/package.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// Get all approved packages
const getAllPackages = catchAsync(async (req, res, next) => {
  const packages = await Package.find({ isApproved: true })
    .populate("vendor division district")
    .sort({ createdAt: -1 });
  
  res.status(200).json({ 
    status: "success", 
    results: packages.length, 
    data: packages 
  });
});

// Get single package
const getPackage = catchAsync(async (req, res, next) => {
  const pkg = await Package.findById(req.params.id)
    .populate("vendor division district");
  
  if (!pkg) {
    return next(new AppError("Package not found", 404));
  }
  
  res.status(200).json({ 
    status: "success", 
    data: pkg 
  });
});

// Create package (vendor submission)
const createPackage = catchAsync(async (req, res, next) => {
  console.log('📦 CREATE PACKAGE REQUEST ===');
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  console.log('User:', req.user);
  console.log('========================');

  try {
    // Handle images
    const images = req.files && req.files.length > 0 
      ? req.files.map(file => file.path) 
      : [];

    console.log('🖼️ Processed images:', images);

    // Parse JSON fields from frontend
    let itinerary = [];
    let highlights = [];
    let inclusions = [];
    let location = { 
      type: "Point", 
      coordinates: [90.3994, 23.7778], 
      address: "" 
    };

    // Parse JSON strings if needed
    try {
      if (req.body.itinerary) {
        itinerary = typeof req.body.itinerary === 'string' 
          ? JSON.parse(req.body.itinerary) 
          : req.body.itinerary;
      }
      
      if (req.body.highlights) {
        highlights = typeof req.body.highlights === 'string' 
          ? JSON.parse(req.body.highlights) 
          : req.body.highlights;
      }
      
      if (req.body.inclusions) {
        inclusions = typeof req.body.inclusions === 'string' 
          ? JSON.parse(req.body.inclusions) 
          : req.body.inclusions;
      }
      
      if (req.body.location) {
        location = typeof req.body.location === 'string' 
          ? JSON.parse(req.body.location) 
          : req.body.location;
      }
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      return next(new AppError('Invalid data format for itinerary, highlights, inclusions, or location', 400));
    }

    // Validate required fields
    const requiredFields = [
      'name', 'description', 'price', 'days', 'nights', 
      'division', 'district'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
    }

    // Validate location data
    if (!location.address || !location.coordinates || location.coordinates.length !== 2) {
      return next(new AppError('Valid location with address and coordinates is required', 400));
    }

    // Create package data
    const packageData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      days: parseInt(req.body.days),
      nights: parseInt(req.body.nights),
      images: images,
      division: req.body.division,
      district: req.body.district,
      location: location,
      itinerary: Array.isArray(itinerary) ? itinerary.filter(item => item && item.trim() !== '') : [],
      highlights: Array.isArray(highlights) ? highlights.filter(item => item && item.trim() !== '') : [],
      inclusions: Array.isArray(inclusions) ? inclusions.filter(item => item && item.trim() !== '') : [],
      vendor: req.user.id,
      isApproved: req.user.role === "admin",
    };

    console.log('📋 FINAL PACKAGE DATA:', packageData);

    // Create the package
    const newPackage = await Package.create(packageData);
    
    // Populate the created package
    const populatedPackage = await Package.findById(newPackage._id)
      .populate("vendor division district");
    
    console.log('✅ PACKAGE CREATED SUCCESSFULLY:', newPackage._id);
    
    res.status(201).json({ 
      status: "success", 
      message: "Tour package created successfully",
      data: populatedPackage 
    });
    
  } catch (error) {
    console.error('❌ CREATE PACKAGE ERROR:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(el => el.message);
      return next(new AppError(`Invalid input data: ${errors.join('. ')}`, 400));
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return next(new AppError('Package with this name already exists', 400));
    }
    
    // Handle cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
      return next(new AppError('Invalid ID format', 400));
    }
    
    next(error);
  }
});

// Update package
const updatePackage = catchAsync(async (req, res, next) => {
  console.log('🔄 UPDATE PACKAGE REQUEST ===');
  console.log('Package ID:', req.params.id);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  console.log('============================');

  try {
    const updateData = { ...req.body };
    
    // Handle images if provided
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    // Parse JSON fields if provided
    if (req.body.itinerary) {
      updateData.itinerary = typeof req.body.itinerary === 'string' 
        ? JSON.parse(req.body.itinerary) 
        : req.body.itinerary;
    }
    
    if (req.body.highlights) {
      updateData.highlights = typeof req.body.highlights === 'string' 
        ? JSON.parse(req.body.highlights) 
        : req.body.highlights;
    }
    
    if (req.body.inclusions) {
      updateData.inclusions = typeof req.body.inclusions === 'string' 
        ? JSON.parse(req.body.inclusions) 
        : req.body.inclusions;
    }
    
    if (req.body.location) {
      updateData.location = typeof req.body.location === 'string' 
        ? JSON.parse(req.body.location) 
        : req.body.location;
    }

    // Convert numeric fields
    if (req.body.price) updateData.price = parseFloat(req.body.price);
    if (req.body.days) updateData.days = parseInt(req.body.days);
    if (req.body.nights) updateData.nights = parseInt(req.body.nights);

    const pkg = await Package.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      {
        new: true,
        runValidators: true,
      }
    ).populate("vendor division district");
    
    if (!pkg) {
      return next(new AppError("Package not found", 404));
    }
    
    res.status(200).json({ 
      status: "success", 
      message: "Package updated successfully",
      data: pkg 
    });
    
  } catch (error) {
    console.error('❌ UPDATE PACKAGE ERROR:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(el => el.message);
      return next(new AppError(`Invalid input data: ${errors.join('. ')}`, 400));
    }
    
    if (error.name === 'CastError') {
      return next(new AppError('Invalid package ID', 400));
    }
    
    next(error);
  }
});

// Delete package
const deletePackage = catchAsync(async (req, res, next) => {
  console.log('🗑️ DELETE PACKAGE REQUEST ===');
  console.log('Package ID:', req.params.id);
  console.log('============================');

  const pkg = await Package.findByIdAndDelete(req.params.id);
  
  if (!pkg) {
    return next(new AppError("Package not found", 404));
  }
  
  console.log('✅ PACKAGE DELETED:', req.params.id);
  
  res.status(200).json({ 
    status: "success", 
    message: "Package deleted successfully",
    data: null 
  });
});

// Get packages by vendor
const getMyPackages = catchAsync(async (req, res, next) => {
  const packages = await Package.find({ vendor: req.user.id })
    .populate("division district")
    .sort({ createdAt: -1 });
  
  res.status(200).json({ 
    status: "success", 
    results: packages.length, 
    data: packages 
  });
});

// Get packages by division
const getPackagesByDivision = catchAsync(async (req, res, next) => {
  const packages = await Package.find({ 
    division: req.params.divisionId,
    isApproved: true 
  })
    .populate("vendor division district")
    .sort({ createdAt: -1 });
  
  res.status(200).json({ 
    status: "success", 
    results: packages.length, 
    data: packages 
  });
});

// Get packages by district
const getPackagesByDistrict = catchAsync(async (req, res, next) => {
  const packages = await Package.find({ 
    district: req.params.districtId,
    isApproved: true 
  })
    .populate("vendor division district")
    .sort({ createdAt: -1 });
  
  res.status(200).json({ 
    status: "success", 
    results: packages.length, 
    data: packages 
  });
});

module.exports = {
  getAllPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  getMyPackages,
  getPackagesByDivision,
  getPackagesByDistrict
};