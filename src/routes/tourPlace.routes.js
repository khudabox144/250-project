const express = require("express");
const {
  getAllTourPlaces,
  getTourPlace,
  createTourPlace,
  updateTourPlace,
  deleteTourPlace
} = require("../controllers/tourPlace.controller.js");

const { protect } = require("../middlewares/auth.middleware.js");
const { roleCheck } = require("../middlewares/role.middleware.js");
const { uploadImages } = require("../middlewares/upload.middleware.js"); // multer config

const router = express.Router();

// Public routes
router.get("/", getAllTourPlaces);
router.get("/:id", getTourPlace);

// Protected routes
router.post("/", protect, uploadImages.array("images"), createTourPlace);
router.put("/:id", protect, roleCheck(["admin", "vendor"]), uploadImages.array("images"), updateTourPlace);
router.delete("/:id", protect, deleteTourPlace);

module.exports = router;

