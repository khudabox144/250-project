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

// Admin read endpoints
router.get('/dashboard', (req, res, next) => {
  // lazy require to avoid circular deps
  const controller = require('../controllers/admin.controller.js');
  return controller.getDashboard(req, res, next);
});

router.get('/pending/tours', (req, res, next) => {
  const controller = require('../controllers/admin.controller.js');
  return controller.getPendingTourPlaces(req, res, next);
});

router.get('/pending/packages', (req, res, next) => {
  const controller = require('../controllers/admin.controller.js');
  return controller.getPendingPackages(req, res, next);
});

router.get('/users', (req, res, next) => {
  const controller = require('../controllers/admin.controller.js');
  return controller.getUsers(req, res, next);
});

// Approve/Reject TourPlace
router.patch("/tour/:id/approve", approveTourPlace);
router.patch("/tour/:id/reject", rejectTourPlace);

// Approve/Reject Package
router.patch("/package/:id/approve", approvePackage);
router.patch("/package/:id/reject", rejectPackage);

module.exports = router;
