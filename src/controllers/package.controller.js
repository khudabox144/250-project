// controllers/package.controller.js
const Package = require("../models/package.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const cloudinaryService = require("../services/cloudinary.service");

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

const createPackage = async (req, res) => {
  try {
    const data = { ...req.body };

    // SYNC: Parse all stringified arrays and objects
    const jsonFields = ["location", "itinerary", "highlights", "inclusions"];
    
    jsonFields.forEach(field => {
      if (typeof data[field] === 'string') {
        data[field] = JSON.parse(data[field]);
      }
    });

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => cloudinaryService.uploadImage(file.buffer));
      const uploaded = await Promise.all(uploadPromises);
      data.images = uploaded.map(u => u.url);
      data.imagePublicIds = uploaded.map(u => u.public_id);
    }

    data.vendor = req.user._id;

    // Normalize division/district if they arrive as objects or JSON strings
    const normalizeId = (val) => {
      if (!val) return val;
      if (typeof val === 'string') {
        try { const p = JSON.parse(val); return p._id || p.id || val; } catch (e) { return val; }
      }
      if (typeof val === 'object') return val._id || val.id || String(val);
      return val;
    };

    data.division = normalizeId(data.division);
    data.district = normalizeId(data.district);

    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'days', 'nights', 'division', 'district'];
    const missing = requiredFields.filter(f => data[f] === undefined || data[f] === null || (typeof data[f] === 'string' && data[f].trim() === ''));
    if (missing.length) {
      return res.status(400).json({ status: 'fail', message: `Missing required fields: ${missing.join(', ')}` });
    }

    // Validate location object
    if (!data.location || !Array.isArray(data.location.coordinates) || data.location.coordinates.length !== 2) {
      return res.status(400).json({ status: 'fail', message: 'Valid location with coordinates is required' });
    }

    // Ensure coordinates are numbers [lng, lat]
    data.location.coordinates = data.location.coordinates.map(c => {
      const n = Number(c); return Number.isFinite(n) ? n : NaN;
    });
    if (!data.location.coordinates.every(Number.isFinite)) {
      return res.status(400).json({ status: 'fail', message: 'Location coordinates must be valid numbers' });
    }

    // Address required by package.model
    data.location.address = (data.location.address || req.body.address || '').toString().trim();
    if (!data.location.address) {
      return res.status(400).json({ status: 'fail', message: 'Location address is required' });
    }

    const newPackage = await Package.create(data);

    res.status(201).json({
      status: "success",
      data: newPackage
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};

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
       const uploadPromises = req.files.map(file => cloudinaryService.uploadImage(file.buffer));
       const uploaded = await Promise.all(uploadPromises);
       updateData.images = uploaded.map(u => u.url);
       updateData.imagePublicIds = uploaded.map(u => u.public_id);
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

    // Normalize division/district if provided (accept JSON/object/string)
    const normalizeId = (val) => {
      if (!val) return val;
      if (typeof val === 'string') {
        try { return (JSON.parse(val))._id || (JSON.parse(val)).id || val; } catch(e) { return val; }
      }
      if (typeof val === 'object') return val._id || val.id || String(val);
      return val;
    };

    if (updateData.division) updateData.division = normalizeId(updateData.division);
    if (updateData.district) updateData.district = normalizeId(updateData.district);

    // Ensure location coordinates are numbers when updating
    if (updateData.location && Array.isArray(updateData.location.coordinates)) {
      updateData.location.coordinates = updateData.location.coordinates.map(c => {
        const n = Number(c); return Number.isFinite(n) ? n : NaN;
      });
      if (!updateData.location.coordinates.every(Number.isFinite)) {
        return next(new AppError('Location coordinates must be valid numbers', 400));
      }
      // If address is provided in update, ensure it's non-empty; if not provided, leave existing address
      if (updateData.location.address !== undefined) {
        updateData.location.address = String(updateData.location.address || '').trim();
        if (!updateData.location.address) {
          return next(new AppError('Location address is required when providing location', 400));
        }
      }
    }

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

  const pkg = await Package.findById(req.params.id);

  if (!pkg) {
    return next(new AppError("Package not found", 404));
  }

  // Delete images from Cloudinary if public IDs exist
  if (Array.isArray(pkg.imagePublicIds) && pkg.imagePublicIds.length) {
    await Promise.all(
      pkg.imagePublicIds.map(async (pid) => {
        try {
          await cloudinaryService.deleteImage(pid);
        } catch (e) {
          console.error('Failed to delete Cloudinary image', pid, e);
        }
      })
    );
  }

  await Package.findByIdAndDelete(req.params.id);

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