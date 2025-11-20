const express =require ("express");
const { createReview, getReviewsByTarget } =require ("../controllers/review.controller.js");
const { protect } =require ("../middlewares/auth.middleware.js");

const router = express.Router();

// POST /api/reviews
router.post("/", protect, createReview);

// GET /api/reviews/:targetType/:targetId
router.get("/:targetType/:targetId", getReviewsByTarget);

module.exports = router;
