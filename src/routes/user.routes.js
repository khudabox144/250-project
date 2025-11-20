const express =require ("express");
const { getUser, updateUser, deleteUser } =require ("../controllers/user.controller.js");
const { protect } =require ("../middlewares/auth.middleware.js");

const router = express.Router();

// GET /api/users/:id
router.get("/:id", protect, getUser);

// PUT /api/users/:id
router.put("/:id", protect, updateUser);

// DELETE /api/users/:id
router.delete("/:id", protect, deleteUser);

module.exports = router;
