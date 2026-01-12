const express = require("express");
const {
  getAllDistricts,
  getDistrictsByDivision,
  createDistrict
} = require("../controllers/district.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

// GET ALL DISTRICTS
router.get("/", getAllDistricts);

// GET DISTRICTS BY DIVISION
router.get("/division/:divisionId", getDistrictsByDivision);

// CREATE DISTRICT
router.post("/", protect, restrictTo("admin"), createDistrict);

module.exports = router;
