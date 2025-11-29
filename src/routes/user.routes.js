const express =require ("express");
const { getUser, updateUser, deleteUser , createUser , getAllUsers } =require ("../controllers/user.controller.js");
const { protect } =require ("../middlewares/auth.middleware.js");

const router = express.Router();

// // POST /api/users  → Create user
// router.post("/", createUser);

// // GET /api/users  → Get all users (optional)
// router.get("/", protect, getAllUsers);

// Current user endpoints (must be before /:id)
router.get('/me/tours', protect, (req, res, next) => require('../controllers/user.controller').getMyTours(req, res, next));
router.get('/me/packages', protect, (req, res, next) => require('../controllers/user.controller').getMyPackages(req, res, next));

// GET /api/users/:id
router.get("/:id", protect, getUser);

// PUT /api/users/:id
router.put("/:id", protect, updateUser);

// DELETE /api/users/:id
router.delete("/:id", protect, deleteUser);

module.exports = router;
