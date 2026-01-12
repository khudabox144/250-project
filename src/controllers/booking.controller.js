const Booking = require("../models/booking.model");
const Package = require("../models/package.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// Create a new booking
const createBooking = catchAsync(async (req, res, next) => {
  let { packageId, package: packageField, bookingDate, participants, contactPhone, specialRequests } = req.body;

  // Debug logging to help identify client payload issues
  console.log('🔔 createBooking payload:', { body: req.body, user: req.user && req.user.id });

  // Accept either `packageId` or `package` as client may send either
  if (!packageId && packageField) {
    // If sent as an object, try to extract its id
    if (typeof packageField === 'string') packageId = packageField;
    else if (packageField._id) packageId = packageField._id;
    else if (packageField.id) packageId = packageField.id;
  }

  if (!packageId || !bookingDate || participants === undefined) {
    return next(new AppError("Please provide all required fields: packageId, bookingDate, participants", 400));
  }

  // Coerce types and validate
  participants = Number(participants);
  if (!Number.isInteger(participants) || participants < 1) {
    return next(new AppError("Participants must be an integer >= 1", 400));
  }

  const parsedDate = new Date(bookingDate);
  if (isNaN(parsedDate.getTime())) {
    return next(new AppError("Invalid bookingDate format", 400));
  }

  const pkg = await Package.findById(packageId);
  if (!pkg) {
    return next(new AppError("Package not found", 404));
  }

  // Prevent duplicate booking requests by same user for same package
  const existingBooking = await Booking.findOne({
    user: req.user._id || req.user.id,
    package: packageId,
    status: { $in: ["pending", "confirmed"] },
  });
  if (existingBooking) {
    return next(new AppError("You already have an active booking request for this package", 400));
  }

  // Calculate total price safely
  const price = Number(pkg.price) || 0;
  const totalPrice = price * participants;

  const booking = await Booking.create({
    user: req.user._id || req.user.id,
    package: packageId,
    vendor: pkg.vendor,
    bookingDate: parsedDate,
    participants,
    totalPrice,
    contactPhone,
    specialRequests,
    status: "pending",
    paymentStatus: "pending",
  });

  // Return populated booking for frontend ease
  const populated = await Booking.findById(booking._id)
    .populate("package")
    .populate("vendor", "username email")
    .populate("user", "username email");

  res.status(201).json({
    status: "success",
    data: populated,
  });
});

// Get user's bookings
const MyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("package")
    .populate("vendor", "username email")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: bookings,
  });
});

// Get vendor's bookings
const getVendorBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ vendor: req.user.id })
    .populate("package")
    .populate("user", "username email")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: bookings,
  });
});

// Update booking status ( Vendor Only)
const updateBookingStatus = catchAsync(async (req, res, next) => {
  const { status, paymentStatus } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  // Verify ownership (only vendor of the package can update or admin)
  if (booking.vendor.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("You do not have permission to update this booking", 403));
  }

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  await booking.save();

  res.status(200).json({
    status: "success",
    data: booking,
  });
});


module.exports = {
  createBooking,
  MyBookings,
  getVendorBookings,
  updateBookingStatus,
};
