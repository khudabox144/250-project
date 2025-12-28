const express = require("express");
const {
  createBooking,
  MyBookings,
  getVendorBookings,
  updateBookingStatus,
} = require("../controllers/booking.controller");
const { protect } = require("../middlewares/auth.middleware");
const { roleCheck } = require("../middlewares/role.middleware");

const router = express.Router();

router.use(protect);

router.post("/", createBooking);
router.get("/my-bookings", MyBookings);
router.get("/vendor-bookings", roleCheck(["vendor", "admin"]), getVendorBookings);
router.put("/:id", roleCheck(["vendor", "admin"]), updateBookingStatus);

module.exports = router;
