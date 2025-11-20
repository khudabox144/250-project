const express = require("express");
const {
  approveTourPlace,
  rejectTourPlace,
  approvePackage,
  rejectPackage,
} = require("../controllers/admin.controller.js");

const { protect } = require("../middlewares/auth.middleware.js");
const { roleCheck } = require("../middlewares/role.middleware.js");

const router = express.Router();

// Protect all admin routes
router.use(protect, roleCheck(["admin"]));

// Approve/Reject TourPlace
router.patch("/tour/:id/approve", approveTourPlace);
router.patch("/tour/:id/reject", rejectTourPlace);

// Approve/Reject Package
router.patch("/package/:id/approve", approvePackage);
router.patch("/package/:id/reject", rejectPackage);

module.exports = router;
