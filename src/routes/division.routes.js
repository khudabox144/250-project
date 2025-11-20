// routes/division.routes.js
const express = require("express");
const { getAllDivisions, createDivision } = require("../controllers/division.controller.js");
const { protect,restrictTo  } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/", getAllDivisions);
router.post("/", protect, restrictTo("admin"), createDivision);

module.exports = router;
