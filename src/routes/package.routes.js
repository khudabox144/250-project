// routes/package.routes.js
const express = require("express");
const {
  getAllPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  getMyPackages,
  getPackagesByDivision,
  getPackagesByDistrict
} = require("../controllers/package.controller.js");

const { protect } = require("../middlewares/auth.middleware.js");
const { roleCheck } = require("../middlewares/role.middleware.js");
const { uploadImages } = require("../middlewares/upload.middleware.js");

const router = express.Router();

// Public routes
router.get("/", getAllPackages);
router.get("/division/:divisionId", getPackagesByDivision);
router.get("/district/:districtId", getPackagesByDistrict);
router.get("/:id", getPackage);

// Protected routes
router.use(protect);

// Vendor-specific routes
router.get("/vendor/my-packages", roleCheck(["vendor"]), getMyPackages);

// Package creation and management
router.post("/", roleCheck(["vendor"]), uploadImages.array("images", 5), createPackage);
router.put("/:id", roleCheck(["vendor", "admin"]), uploadImages.array("images", 5), updatePackage);
router.delete("/:id", roleCheck(["admin"]), deletePackage);

module.exports = router;