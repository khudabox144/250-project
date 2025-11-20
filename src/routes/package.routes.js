const express =require ("express");
const {
  getAllPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage
} =require ("../controllers/package.controller.js");

const { protect } =require ("../middlewares/auth.middleware.js");
const { roleCheck } =require ("../middlewares/role.middleware.js");
const { uploadImages } =require ("../middlewares/upload.middleware.js");

const router = express.Router();

// GET /api/packages
router.get("/", getAllPackages);

// GET /api/packages/:id
router.get("/:id", getPackage);

// POST /api/packages (vendor submission)
router.post("/", protect, roleCheck(["vendor"]), uploadImages.array("images"), createPackage);

// PUT /api/packages/:id
router.put("/:id", protect, roleCheck(["vendor", "admin"]), uploadImages.array("images"), updatePackage);

// DELETE /api/packages/:id
router.delete("/:id", protect, roleCheck(["admin"]), deletePackage);

module.exports = router;
