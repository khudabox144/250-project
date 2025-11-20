// routes/district.routes.js
const express = require("express");
const { getDistrictsByDivision, createDistrict } = require("../controllers/district.controller.js");
const { protect ,restrictTo } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/:divisionId", getDistrictsByDivision);
router.post("/", protect, restrictTo("admin"), createDistrict);

module.exports = router;
