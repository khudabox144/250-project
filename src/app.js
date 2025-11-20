const express = require("express");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const tourRoutes = require("./routes/tourPlace.routes.js");
const packageRoutes = require("./routes/package.routes.js");
const reviewRoutes = require("./routes/review.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const divisionRoutes= require("./routes/division.routes.js")
const districtRoutes= require("./routes/district.routes.js")
const AppError = require("./utils/AppError.js");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/divisions", divisionRoutes);
app.use("/api/districts", districtRoutes);

app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
