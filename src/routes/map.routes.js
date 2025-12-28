const express = require("express");
const { getRoute } = require("../controllers/map.controller");

const router = express.Router();

router.get("/route", getRoute);

module.exports = router;
